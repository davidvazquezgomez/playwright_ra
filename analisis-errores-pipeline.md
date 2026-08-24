# Analisis y plan de resolucion del pipeline

## 1. Contexto de la ejecucion

- Fecha del pipeline: `2026-08-21`.
- Entorno: `STAGE / Desktop`.
- Runner: Azure Pipelines con Node 24.
- Pruebas iniciadas: `1076`.
- Workers: `4`.
- Fichero fuente: [ejecucion-pipeline.md](ejecucion-pipeline.md).
- El log no incluye un resumen agregado final fiable de pruebas pasadas y fallidas.

### Criterio de lectura

El numero de apariciones en el log no equivale al numero de bugs. Un mismo problema se repite por rol, ejemplo y feature. Primero deben resolverse los fallos de infraestructura y contrato BDD; despues se debe repetir el pipeline para obtener una fotografia funcional limpia.

## 2. Prioridades globales

| Prioridad | Familia                          |                           Volumen observado | Estado              | Objetivo                                                           |
| --------- | -------------------------------- | ------------------------------------------: | ------------------- | ------------------------------------------------------------------ |
| P0        | Pasos BDD inexistentes           |                             120 apariciones | En curso (Lucia)    | Todas las frases de las features deben tener binding               |
| P0        | Timeouts de Playwright           |                             147 apariciones | Pendiente           | Las paginas y controles comunes deben cargar de forma determinista |
| P1        | Acciones y botones no soportados |                    Repetido en varios roles | En curso            | Los page objects deben reconocer todas las acciones validas        |
| P1        | Concurrencia y autenticacion     | 3 locks de auth y varios contextos cerrados | Pendiente           | Cada worker debe usar estado y datos aislados                      |
| P1        | Flujos incompatibles con el rol  |               Repetido en usuarios externos | Pendiente           | No ejecutar campos internos en formularios externos                |
| P1        | Defectos funcionales confirmados |   65 mensajes `APPLICATION DEFECT DETECTED` | Pendiente de triage | Corregir producto o confirmar datos/permisos                       |
| P2        | Datos y selectores fragiles      |                                    Repetido | Pendiente           | Reducir dependencia de nombres y texto variable                    |

## 3. Plan de trabajo recomendado

### Fase 1: reparar el contrato BDD

#### Prioridad: P0

Las frases siguientes aparecen como `Missing step`:

- `Then verify the data is updated to show the applied filter records in the "Updates" dashboard`.
- `Then verify the data is updated to show the applied filter records in the "Actions" dashboard`.
- `Then verify the page is redirected to "Updates Dashboard"`.
- `When open the "Attachments" tab in the ... popup`.
- `And press "Clear" button on the search field if available`.
- `When click on "..." Client Portal from the client portal list`.
- `And save the team from the "Create/Edit Team" page`.
- `Then verify the "Unsaved Changes" popup is displayed`.
- `Then verify the "Responsible User" field displays the corresponding value`.
- `Then verify it displays "Update Privacy Notice" page`.
- Frases de validacion de Privacy Notice.
- Frases de hover y seleccion de tipos de notificacion.

**Acciones:**

1. Buscar cada frase en `features/**/*.feature` y `features/steps/**/*.ts`.
2. Elegir una frase canonica cuando existan variantes con distinta capitalizacion.
3. Crear el binding en el step file propietario.
4. Delegar toda la interaccion en el page object correspondiente.
5. Eliminar variantes duplicadas o actualizar las features para usar la frase canonica.

**Validacion de cierre:**

```powershell
npm run bdd:generate
```

Resultado esperado: cero mensajes `Missing step`.

**Puntos del log:** [primer bloque de pasos ausentes](ejecucion-pipeline.md#L1961), [attachments](ejecucion-pipeline.md#L2391), [Team Management](ejecucion-pipeline.md#L15233), [Privacy Notice](ejecucion-pipeline.md#L22589).

### Fase 2: estabilizar autenticacion y ejecucion paralela - implementada, pendiente certificacion en Azure

#### Prioridad: P0/P1

El mismo lock de autenticacion se solicita simultaneamente:

```text
test-results/auth-state/stage/90fba5ec7c0be550.json.lock
Timed out waiting for authentication state lock
```

Tambien aparecen errores derivados:

```text
Target page, context or browser has been closed
browserContext.close: Target page, context or browser has been closed
```

**Archivos a revisar:**

- `utils/AuthStateManager.ts`.
- `features/steps/fixtures.ts`.
- Configuracion de workers en `playwright.bdd.config.ts`.

**Acciones:**

1. Generar un estado de autenticacion por entorno, usuario, rol y worker cuando sea necesario.
2. Revisar la creacion y eliminacion del fichero `.lock` en todos los caminos de error.
3. Evitar que varios escenarios mutables compartan usuario y datos al mismo tiempo.
4. Ejecutar primero con un worker para distinguir concurrencia de defectos funcionales.

```powershell
npx playwright test --workers=1
```

**Implementado en esta fase:**

- Espera del lock configurable, con cinco minutos por defecto.
- Deteccion y limpieza de locks huérfanos solo cuando el proceso propietario ya no esta activo.
- Token por propietario para impedir que un worker elimine el lock de otro.
- Cierre del contexto del fixture mediante `try/finally`.
- Prewarm limitado a ejecuciones CI/Azure; las ejecuciones locales y la UI lo omiten.

**Validacion de cierre en Azure:**

- Cero `Timed out waiting for authentication state lock`.
- Cero errores de contexto cerrado derivados del fixture.
- El login llega de forma consistente a `#headerTile`.

La prueba local no pudo alcanzar el login porque Stage devolvio `Access denied` durante el prewarm. Por ello, la certificacion runtime debe ejecutarse en Azure o desde una red permitida por el WAF de Stage.

**Puntos del log:** [lock de autenticacion](ejecucion-pipeline.md#L3190), [contexto cerrado](ejecucion-pipeline.md#L2169).

### Fase 3: corregir acciones no reconocidas - en curso

#### Prioridad P1: acciones no reconocidas

Se repiten errores de dispatching:

- `Button "Dashboard Options" is not recognized`.
- `Button "Dashboard options" is not recognized`.
- `Button "Mark as Unread" is not recognized`.
- `Button "Attachments" is not recognized`.
- `Unsupported Overview button "Dashboard Options"`.
- `Team Management button "Remove" is not supported`.

**Causa probable:** las features usan acciones que no estan implementadas en los page objects, o se esta intentando resolver una accion de dashboard desde `OverviewPage`.

**Acciones:**

| Accion                                        | Page object propietario |
| --------------------------------------------- | ----------------------- |
| Abrir filtros y opciones de dashboard         | `DashboardPage`         |
| Abrir tab de attachments de una actualizacion | `UpdatesDashboardPage`  |
| Marcar como leida/no leida                    | `UpdatesDashboardPage`  |
| Eliminar un equipo                            | `TeamManagementPage`    |
| Botones propios de Overview                   | `OverviewPage`          |

1. Normalizar la frase canonica a `Dashboard Options`.
2. No anadir botones de dashboard al dispatcher de Overview.
3. Implementar las acciones como metodos de negocio del page object propietario.
4. Revisar primero `BasePage.ts` para reutilizar esperas y clicks existentes.

**Validacion de cierre:** buscar de nuevo `not recognized`, `not supported` y `Unsupported Overview button` en el log de una ejecucion reducida.

**Avance implementado:**

- `Dashboard Options` se resuelve desde `DashboardPage`.
- `Mark as Unread` y `Attachments` de Update Details se resuelven desde `UpdatesDashboardPage`.
- `saveTeam` se resuelve desde `TeamManagementPage`.
- `Remove` de adjuntos del Update Action popup se resuelve desde `ActionsDashboardPage` y ya tiene binding BDD.

**Puntos del log:** [Dashboard Options](ejecucion-pipeline.md#L1988), [Mark as Unread](ejecucion-pipeline.md#L2236), [Attachments](ejecucion-pipeline.md#L2553), [Remove](ejecucion-pipeline.md#L15386).

### Fase 4: revisar selectores, esperas y dialogs

#### Prioridad P1: selectores y dialogs

Selectores que fallan con frecuencia:

- `button:has-text("Add Action")`.
- `button[title="Filter"]`.
- `input[placeholder="Select or type update title"][role="combobox"]`.
- `#headerTile`.
- `app-table .k-pager-info`.
- Mensajes de validacion dentro de `kendo-dialog`.

**Causas probables:** pagina incorrecta, sesion no autenticada, selector desactualizado, datos no disponibles o dialogo superpuesto.

Hay un caso de click bloqueado por un dialogo Kendo que sigue abierto:

```text
<kendo-dialog class="... filtar-popup ..."> intercepts pointer events
```

**Acciones:**

1. Abrir screenshot, `error-context.md` y trace del primer fallo de cada selector.
2. Confirmar el DOM real antes de modificar el selector.
3. Preferir roles y nombres accesibles frente a selectores basados solo en texto.
4. Esperar a que el dialogo desaparezca despues de guardar, cancelar o aplicar filtros.
5. Mantener los selectores privados dentro del page object propietario.
6. No usar `force: true` para ocultar un problema de estado visual.

**Validacion de cierre:** ejecutar un escenario representativo de cada superficie: Actions Dashboard, Updates Dashboard, Notifications y Team Management.

**Puntos del log:** [Add Action](ejecucion-pipeline.md#L1159), [Filter](ejecucion-pipeline.md#L1195), [pager](ejecucion-pipeline.md#L400), [dialogo interceptando clicks](ejecucion-pipeline.md#L2863).

### Fase 5: separar los flujos por rol

#### Prioridad P1: flujos por rol

Errores observados:

- `Field "User Assigned" is not supported for external users`.
- `Field "Comments" is not supported for external users`.
- `Field "Watch List" is not supported for external users`.
- `Field "Team Name" is not supported for external users`.

**Diagnostico:** escenarios externos ejecutan pasos destinados a formularios internos, o el step reutilizado delega al metodo incorrecto de `UserManagementPage`.

**Acciones:**

1. Revisar el `Background` y el usuario autenticado de cada feature.
2. Separar pasos de actualizaciones, acciones, equipos y usuarios externos.
3. No usar `enterExternalUserField` para campos de equipos o actualizaciones.
4. Confirmar que los datos de prueba existen para el rol que ejecuta el escenario.

**Validacion de cierre:** ningun escenario de `ClientUser` o usuario externo debe fallar con `not supported for external users` cuando el flujo sea valido para ese rol.

**Punto del log:** [campos incompatibles con el rol](ejecucion-pipeline.md#L2267).

## 4. Defectos funcionales confirmados

Estos errores tienen prioridad despues de estabilizar BDD, autenticacion y selectores. La suite alcanzo una comprobacion de negocio y encontro un resultado contradictorio; estan marcados con `APPLICATION DEFECT DETECTED`.

### 4.1 Ordenacion de grids

Problemas observados:

- `User Assigned` en Actions Dashboard.
- `Last Updated` en Updates Dashboard.
- `Team Name` y `Updated Date` en Team Management.
- `User Name` en User Management.
- `Impact Area` en Automatic Allocation.

El patron comun es que el header declara `aria-sort="ascending"`, pero los datos no estan ordenados de forma ascendente.

**Hipotesis tecnica:** algunos valores se ordenan como texto en vez de usar su tipo real. Es especialmente sospechoso para fechas relativas como `3 month(s) ago` y `5 month(s) ago`, y para valores vacios como `Unassigned` o `N/A`.

**Acciones:**

1. Reproducir un caso de texto, fecha absoluta, fecha relativa y valor vacio.
2. Confirmar si el orden se realiza en frontend o backend.
3. Revisar que `aria-sort` se actualiza despues de completar la carga del grid.
4. Definir el criterio esperado para valores vacios y duplicados.
5. Mantener la asercion de negocio en `CommonPage.verifyGridItemsSorted`.

**Evidencia:** [Actions Dashboard](ejecucion-pipeline.md#L1123), [Updates Dashboard](ejecucion-pipeline.md#L2200), [Team Management](ejecucion-pipeline.md#L15386), [User Management](ejecucion-pipeline.md#L15800), [Automatic Allocation](ejecucion-pipeline.md#L16000).

### 4.2 Boton Edit Client ausente

Para usuarios Deloitte se muestra una fila de portal, pero no aparece el boton `Edit Client`.

```text
Expected: The Edit Client button is displayed
Actual: The expected element is not displayed
Evidence: At least one Client Portal List data row is visible
```

**Causas que deben comprobarse antes de tocar el locator:**

- permisos del usuario Deloitte;
- configuracion del portal;
- portal o datos de Stage equivocados;
- regresion en la lista de portales;
- boton realmente oculto por el DOM y no solo localizado incorrectamente.

**Evidencia:** [Edit Client ausente](ejecucion-pipeline.md#L9565).

### 4.3 Email vacio en el perfil

El popup de perfil aparece y el nombre es correcto, pero el email llega vacio:

```text
Expected email: "t-taxcmsSA0001@deloitte.com"
Actual email: ""
```

**Revision recomendada:** respuesta del backend, binding del campo email y datos del usuario en Stage.

**Evidencia:** [email de perfil](ejecucion-pipeline.md#L18696).

### 4.4 Asignacion automatica inexistente

Se esperaba editar `01_QA_UserManagement`, pero el grid no contenia filas.

Esto no debe clasificarse aun como defecto de producto. Primero hay que comprobar si el dato fue creado, eliminado por otro escenario o aislado por la ejecucion paralela.

**Evidencia:** [allocation sin filas](ejecucion-pipeline.md#L23488).

## 5. Errores que no deben clasificarse como defecto de aplicacion

No abrir un bug de producto basandose solo en:

- `TimeoutError`.
- Locator no encontrado.
- Login que no llega a `#headerTile`.
- `Target page, context or browser has been closed`.
- `Missing step`.
- Boton no reconocido por un dispatcher.
- Campo no soportado por un page object.
- Datos inexistentes sin comprobar previamente el estado inicial.

Estos errores son tecnicos o de automatizacion hasta que una prueba independiente confirme que la UI esta disponible y contradice una regla de negocio.

## 6. Matriz de seguimiento

| ID      | Problema                          | Prioridad | Area                               | Evidencia                                | Responsable sugerido     | Criterio de cierre                                                 |
| ------- | --------------------------------- | --------- | ---------------------------------- | ---------------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| BDD-01  | Pasos `Missing step`              | P0        | `features/steps`                   | 120 apariciones                          | Mantenimiento QA         | `bdd:generate` sin pasos ausentes                                  |
| AUTH-01 | Lock compartido de auth           | P0        | `utils/AuthStateManager.ts`        | Lock de Stage                            | QA/Infra                 | Solucion implementada; pendiente validar en Azure sin bloqueos WAF |
| UI-01   | Selectores comunes no encontrados | P1        | `pages/BasePage.ts` y page objects | 147 timeouts                             | Mantenimiento QA         | Escenarios base estables                                           |
| UI-02   | Botones no reconocidos            | P1        | `CommonPage`, `OverviewPage`       | Dispatchers                              | Mantenimiento QA         | Cero `not recognized`                                              |
| ROLE-01 | Campos incorrectos para externos  | P1        | Features y page objects            | `User Assigned`, `Comments`, `Team Name` | QA funcional             | Flujos separados por rol                                           |
| DATA-01 | Datos compartidos entre workers   | P1        | Fixtures/test-data                 | Allocation ausente                       | QA/Infra                 | Datos aislados o precondiciones verificadas                        |
| APP-01  | Ordenacion inconsistente          | P1        | Aplicacion                         | `aria-sort` contradice filas             | Equipo producto          | Orden correcto para cada tipo de dato                              |
| APP-02  | `Edit Client` ausente             | P1        | Client Portal List                 | 9565                                     | Equipo producto/permisos | Accion visible para usuario autorizado                             |
| APP-03  | Email de perfil vacio             | P1        | Perfil/API                         | 18696                                    | Equipo producto/API      | Email esperado visible                                             |
| APP-04  | Mensajes de notificacion          | P2        | Notifications                      | Toast ausente                            | Equipo producto/QA       | Toast y persistencia verificados                                   |

## 7. Secuencia de validacion final

Ejecutar en este orden:

```powershell
npm run bdd:generate
npx tsc --noEmit
npx playwright test --workers=1
npx playwright test --workers=4
```

Tras cada ejecucion, volver a contar estas cadenas:

```text
Missing step
TimeoutError
not recognized
authentication state lock
Target page, context or browser has been closed
APPLICATION DEFECT DETECTED
```

El objetivo es que cada repeticion reduzca primero los errores tecnicos y deje visibles solo los defectos funcionales reproducibles. Los traces asociados a los casos que sigan fallando se pueden abrir con:

```powershell
npx playwright show-trace test-results/<carpeta-del-test>/trace.zip
```

## 8. Resumen de prioridad

1. Resolver bindings BDD ausentes (fase en curso con la compañera).
2. Aislar autenticacion, usuarios y datos de prueba por worker (fase 2 implementada; validacion runtime pendiente en Azure por bloqueo WAF local).
3. Corregir botones y acciones no soportadas (fase 3 en curso).
4. Revisar DOM, selectores, esperas y cierre de dialogs.
5. Separar los flujos internos y externos.
6. Repetir el pipeline con un worker y despues con cuatro.
7. Abrir o confirmar bugs de producto solo para los defectos funcionales que sobrevivan a las fases anteriores.
