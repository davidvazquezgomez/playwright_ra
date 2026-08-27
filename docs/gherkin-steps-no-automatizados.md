# Inventario de Steps Gherkin Sin Automatizar

Fecha de analisis: 2026-08-27

## Alcance

- Features analizados: 77
- Archivos de definicion revisados: 18 (`features/steps/**/*.ts`)
- Definiciones Gherkin unicas sin binding: 98
- Ocurrencias sin resolver: 798

El inventario se obtuvo ejecutando `playwright-bdd` con `BDD_MISSING_STEPS_MODE=fail-on-gen`. Cada entrada representa una definicion que el generador no pudo asociar a ningun step existente.

## Criterio de Implementacion

Cada item debe implementarse como una definicion fina en `features/steps/`, delegando los selectores, acciones y aserciones a su page object propietario. Antes de crear un binding, buscar frases equivalentes y consolidarlas en una unica expresion canonica.

## Definiciones Pendientes

### 1. `Then verify the page is redirected to Updates Dashboard`

- **Binding sugerido:** `Then('verify the page is redirected to Updates Dashboard', async ({}) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:14:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:14:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:14:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:14:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:14:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:14:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:14:5`

### 2. `And verify "Generate Report" option is displayed`

- **Binding sugerido:** `Then('verify {string} option is displayed', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:17:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:17:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:17:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:17:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:17:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:17:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:17:5`

### 3. `When click on "Generate Report" option from the Dashboard options`

- **Binding sugerido:** `When('click on {string} option from the Dashboard options', async ({}, arg: string) => {`
- **Ocurrencias (49):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:18:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:40:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:57:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:78:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:96:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:116:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:132:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:18:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:40:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:57:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:78:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:96:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:116:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:132:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:18:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:39:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:55:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:75:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:92:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:111:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:126:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:18:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:39:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:55:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:75:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:92:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:111:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:126:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:18:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:39:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:55:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:75:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:92:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:111:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:126:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:18:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:39:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:55:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:75:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:92:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:111:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:126:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:18:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:40:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:56:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:76:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:93:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:112:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:127:5`

### 4. `Then verify the dashboard dropdown default value is "Updates"`

- **Binding sugerido:** `Then('verify the dashboard dropdown default value is {string}', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:19:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:19:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:19:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:19:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:19:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:19:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:19:5`

### 5. `And verify the "Update Title;Jurisdiction;Impact Area;Date Announced;Date Effective;Priority;Status;Last Updated" columns are selected in the Dashboard Options popup`

- **Binding sugerido:** `Then('verify the {string} columns are selected in the Dashboard Options popup', async ({}, arg: string) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:20:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:59:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:20:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:59:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:20:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:57:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:20:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:57:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:20:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:57:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:20:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:57:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:20:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:58:5`

### 6. `And verify "Generate Report" button is displayed in the pop up`

- **Binding sugerido:** `Then('verify {string} button is displayed in the pop up', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:21:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:21:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:21:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:21:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:21:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:21:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:21:5`

### 7. `Then wait for the download completion notification`

- **Binding sugerido:** `Then('wait for the download completion notification', async ({}) => {`
- **Ocurrencias (28):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:23:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:44:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:61:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:82:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:23:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:44:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:61:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:82:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:23:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:43:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:59:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:79:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:23:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:43:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:59:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:79:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:23:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:43:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:59:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:79:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:23:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:43:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:59:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:79:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:23:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:44:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:60:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:80:5`

### 8. `And verify the downloaded file name format is "ClientPortal_20260213081718_Updates_Report_" with current date and time`

- **Binding sugerido:** `Then('verify the downloaded file name format is {string} with current date and time', async ({}, arg: string) => {`
- **Ocurrencias (56):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:24:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:45:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:62:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:83:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:101:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:119:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:137:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:154:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:24:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:45:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:62:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:83:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:101:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:119:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:137:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:155:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:24:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:44:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:60:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:80:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:97:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:114:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:131:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:148:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:24:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:44:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:60:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:80:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:97:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:114:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:131:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:148:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:24:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:44:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:60:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:80:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:97:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:114:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:131:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:148:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:24:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:44:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:60:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:80:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:97:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:114:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:131:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:148:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:24:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:45:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:61:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:81:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:98:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:115:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:132:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:149:5`

### 9. `When read the downloaded excel file content`

- **Binding sugerido:** `When('read the downloaded excel file content', async ({}) => {`
- **Ocurrencias (56):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:25:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:46:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:63:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:84:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:102:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:120:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:138:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:155:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:25:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:46:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:63:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:84:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:102:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:120:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:138:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:156:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:25:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:45:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:61:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:81:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:98:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:115:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:132:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:149:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:25:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:45:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:61:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:81:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:98:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:115:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:132:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:149:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:25:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:45:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:61:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:81:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:98:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:115:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:132:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:149:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:25:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:45:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:61:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:81:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:98:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:115:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:132:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:149:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:25:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:46:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:62:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:82:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:99:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:116:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:133:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:150:5`

### 10. `Then verify the excel file contains the "Title;AnnouncementDateDisplay;EffectiveDateDisplay;LastUpdated;Priority;Status;Jurisdiction;ImpactArea" column headers`

- **Binding sugerido:** `Then('verify the excel file contains the {string} column headers', async ({}, arg: string) => {`
- **Ocurrencias (56):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:26:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:47:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:64:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:85:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:103:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:121:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:139:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:156:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:26:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:47:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:64:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:85:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:103:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:121:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:139:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:157:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:26:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:46:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:62:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:82:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:99:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:116:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:133:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:150:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:26:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:46:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:62:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:82:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:99:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:116:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:133:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:150:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:26:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:46:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:62:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:82:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:99:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:116:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:133:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:150:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:26:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:46:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:62:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:82:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:99:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:116:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:133:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:150:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:26:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:47:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:63:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:83:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:100:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:117:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:134:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:151:5`

### 11. `Then verify the data is updated to show the applied filter records in the "Updates" dashboard`

- **Binding sugerido:** `Then('verify the data is updated to show the applied filter records in the {string} dashboard', async ({}, arg: string) => {`
- **Ocurrencias (27):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:36:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:74:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:113:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:148:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:36:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:74:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:113:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:149:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:35:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:71:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:108:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:142:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:35:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:71:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:108:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:142:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:35:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:71:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:108:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:142:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:35:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:71:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:108:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:142:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:72:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:109:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:143:5`

### 12. `And verify "Generate Report" option is displayed and clickable in the Dashboard options`

- **Binding sugerido:** `Then('verify {string} option is displayed and clickable in the Dashboard options', async ({}, arg: string) => {`
- **Ocurrencias (21):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:39:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:56:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:77:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:39:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:56:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:77:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:38:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:54:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:74:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:38:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:54:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:74:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:38:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:54:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:74:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:38:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:54:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:74:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:39:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:55:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:75:5`

### 13. `Then verify the dashboard dropdown value is "Updates"`

- **Binding sugerido:** `Then('verify the dashboard dropdown value is {string}', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:41:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:41:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:40:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:40:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:40:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:40:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:41:5`

### 14. `And verify the filters applied in the Updates dashboard are prechecked in the Generate Report options`

- **Binding sugerido:** `Then('verify the filters applied in the Updates dashboard are prechecked in the Generate Report options', async ({}) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:42:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:42:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:41:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:41:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:41:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:41:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:42:5`

### 15. `And verify the report is generated with the same filters and options applied in the "Updates" dashboard`

- **Binding sugerido:** `Then('verify the report is generated with the same filters and options applied in the {string} dashboard', async ({}, arg: string) => {`
- **Ocurrencias (28):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:48:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:86:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:122:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:157:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:48:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:86:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:122:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:158:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:47:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:83:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:117:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:151:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:47:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:83:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:117:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:151:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:47:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:83:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:117:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:151:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:47:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:83:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:117:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:151:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:48:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:84:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:118:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:152:5`

### 16. `And select "Actions" from the "Generate report for" dropdown`

- **Binding sugerido:** `When('select {string} from the {string} dropdown', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:58:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:79:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:58:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:79:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:56:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:76:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:56:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:76:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:56:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:76:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:56:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:76:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:57:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:77:5`

### 17. `Then verify the filters applied in the Actions dashboard are prechecked in the Generate Report options`

- **Binding sugerido:** `Then('verify the filters applied in the Actions dashboard are prechecked in the Generate Report options', async ({}) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:80:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:80:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:77:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:77:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:77:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:77:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:78:5`

### 18. `Then verify the page is redirected to "Updates Dashboard"`

- **Binding sugerido:** `Then('verify the page is redirected to {string}', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:92:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:92:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:88:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:88:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:88:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:88:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:89:5`

### 19. `And verify "Generate Audit Trail" option is displayed in the Dashboard options`

- **Binding sugerido:** `Then('verify {string} option is displayed in the Dashboard options', async ({}, arg: string) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:95:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:131:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:95:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:131:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:91:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:125:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:91:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:125:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:91:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:125:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:91:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:125:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:92:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:126:5`

### 20. `Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed`

- **Binding sugerido:** `Then('verify the {string} audit trail change area parameters are displayed', async ({}, arg: string) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:97:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:133:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:97:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:133:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:93:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:127:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:93:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:127:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:93:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:127:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:93:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:127:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:94:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:128:5`

### 21. `When select different audit trail parameters`

- **Binding sugerido:** `When('select different audit trail parameters', async ({}) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:98:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:134:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:98:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:134:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:94:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:128:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:94:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:128:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:94:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:128:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:94:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:128:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:95:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:129:5`

### 22. `Then verify the notification area displays the report generation status`

- **Binding sugerido:** `Then('verify the notification area displays the report generation status', async ({}) => {`
- **Ocurrencias (28):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:100:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:118:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:136:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardOptions_ClientAdmin.feature:153:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:100:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:118:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:136:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardOptions_ClientUser.feature:154:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:96:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:113:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:130:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardOptions_TeamLeader.feature:147:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:96:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:113:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:130:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardOptions_TeamMember.feature:147:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:96:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:113:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:130:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardOptions_DeloitteUser.feature:147:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:96:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:113:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:130:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardOptions_PortalAdmin.feature:147:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:97:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:114:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:131:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardOptions_SuperAdmin.feature:148:5`

### 23. `And press "clear" in the "Watch List" field`

- **Binding sugerido:** `Then('press {string} in the {string} field', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (6):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:75:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:71:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:75:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:75:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:75:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:75:5`

### 24. `Then verify "satestclientuser2, satestclientuser2" value is displayed in the "User Assigned" field`

- **Binding sugerido:** `Then('verify {string} value is displayed in the {string} field', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (20):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:94:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:95:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:96:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:97:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:94:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:95:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:96:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:97:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:94:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:95:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:96:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:97:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:94:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:95:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:96:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:97:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:94:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:95:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:96:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:97:5`

### 25. `And verify the "User Assigned" field does not display "satestclientuser2, satestclientuser2"`

- **Binding sugerido:** `Then('verify the {string} field does not display {string}', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (24):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:114:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:115:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:116:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:117:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:104:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:105:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:114:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:115:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:116:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:117:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:86:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:87:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:114:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:115:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:116:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:117:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:114:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:115:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:116:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:117:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:114:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:115:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:116:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:117:5`

### 26. `Then verify the posted comment is seen along with timestamp and edit, reply and delete option`

- **Binding sugerido:** `Then('verify the posted comment is seen along with timestamp and edit, reply and delete option', async ({}) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:126:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:114:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:126:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:96:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:126:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:126:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:126:5`

### 27. `Then verify the comment is not displayed in the "Comments" field`

- **Binding sugerido:** `Then('verify the comment is not displayed in the {string} field', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:129:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:117:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:129:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:99:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:129:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:129:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:129:5`

### 28. `And click on "Upload files" option from the "Test_11-5_01" page`

- **Binding sugerido:** `When('click on {string} option from the {string} page', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (14):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:137:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:159:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:125:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:147:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:137:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:159:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:107:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:129:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:137:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:159:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:137:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:158:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:137:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:159:5`

### 29. `And verify the "valid.pdf" attachment is displayed in the "Attachments" section`

- **Binding sugerido:** `Then('verify the {string} attachment is displayed in the {string} section', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (6):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:139:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:127:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:139:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:109:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:139:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:139:5`

### 30. `Then verify the attachment is not displayed in the "Attachments" section`

- **Binding sugerido:** `Then('verify the attachment is not displayed in the {string} section', async ({}, arg: string) => {`
- **Ocurrencias (8):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:142:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:130:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:142:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:112:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:142:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:142:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:161:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:142:5`

### 31. `And verify the "valid.xls" attachment is not displayed in the "Attachments" section`

- **Binding sugerido:** `Then('verify the {string} attachment is not displayed in the {string} section', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (6):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:162:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:150:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:162:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:132:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:162:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:162:5`

### 32. `Then verify only updates that contain "Income" in the title are displayed in the "01_QA_StageTestPortal - Updates Dashboard" page`

- **Binding sugerido:** `Then('verify only updates that contain {string} in the title are displayed in the {string} page', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:178:5`

### 33. `When press "Enter" key on the keyboard`

- **Binding sugerido:** `When('press {string} key on the keyboard', async ({}, arg: string) => {`
- **Ocurrencias (12):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:179:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:190:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:167:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:178:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:179:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:190:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:149:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:160:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:179:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:190:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:179:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:190:5`

### 34. `Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same`

- **Binding sugerido:** `Then('verify the {string} item count is not the same', async ({}, arg: string) => {`
- **Ocurrencias (54):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:180:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:191:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:224:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:256:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:269:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:282:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:291:5`
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:295:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:168:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:179:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:212:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:244:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:257:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:270:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:279:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:283:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:180:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:191:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:224:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:256:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:269:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:282:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:291:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:295:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:150:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:161:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:194:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:226:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:239:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:252:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:261:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:265:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:180:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:191:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:224:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:256:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:269:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:282:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:291:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:295:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:198:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:229:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:241:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:254:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:263:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:267:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:180:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:191:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:224:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:256:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:269:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:282:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:291:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:295:5`

### 35. `Then verify no updates are displayed`

- **Binding sugerido:** `Then('verify no updates are displayed', async ({}) => {`
- **Ocurrencias (6):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:189:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:177:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:189:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:159:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:189:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:189:5`

### 36. `Then select "Date Announced" on the Dashboard filter`

- **Binding sugerido:** `Then('select {string} on the Dashboard filter', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:219:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:207:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:219:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:189:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:219:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:193:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:219:5`

### 37. `Then press "Save as favourite" button for "Test_ClientAdmin" on the Dashboard filter`

- **Binding sugerido:** `Then('press {string} button for {string} on the Dashboard filter', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:264:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:252:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:264:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:234:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:264:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:236:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:264:5`

### 38. `When press "Remove as favourite" button for "Test_ClientAdmin" on the Dashboard filter`

- **Binding sugerido:** `When('press {string} button for {string} on the Dashboard filter', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:270:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:258:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:270:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:240:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:270:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:242:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:270:5`

### 39. `And verify the "Updates Dashboard" tab is selected in the Dashboard Options popup`

- **Binding sugerido:** `When('verify the {string} tab is selected in the Dashboard Options popup', async ({}, arg: string) => {`
- **Ocurrencias (7):**
  - `features/RA_EXT_ClientAdminTestCases/DashboardUpdates_ClientAdmin.feature:328:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:316:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:328:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:298:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:328:5`
  - `features/RA_INT_PortalAdminTestCases/DashboardUpdates_PortalAdmin.feature:300:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:328:5`

### 40. `When save the team from the "Create/Edit Team" page`

- **Binding sugerido:** `When('save the team from the {string} page', async ({}, arg: string) => {`
- **Ocurrencias (27):**
  - `features/RA_EXT_ClientAdminTestCases/Notifications_ClientAdmin.feature:264:5`
  - `features/RA_EXT_ClientAdminTestCases/Notifications_ClientAdmin.feature:303:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:21:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:48:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:63:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:73:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:19:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:41:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:51:5`
  - `features/RA_INT_DeloitteUserTestCases/Notifications_DeloitteUser.feature:168:5`
  - `features/RA_INT_DeloitteUserTestCases/Notifications_DeloitteUser.feature:190:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:15:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:58:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:71:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:80:5`
  - `features/RA_INT_PortalAdminTestCases/Notifications_PortalAdmin.feature:264:5`
  - `features/RA_INT_PortalAdminTestCases/Notifications_PortalAdmin.feature:303:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:15:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:58:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:71:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:80:5`
  - `features/RA_INT_SuperAdminTestCases/Notifications_SuperAdmin.feature:264:5`
  - `features/RA_INT_SuperAdminTestCases/Notifications_SuperAdmin.feature:303:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:15:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:58:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:71:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:80:5`

### 41. `When click on "ClientPortal_20260213081718" Client Portal from the client portal list`

- **Binding sugerido:** `When('click on {string} Client Portal from the client portal list', async ({}, arg: string) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:7:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:10:5`

### 42. `And verify "Create Team" button is available`

- **Binding sugerido:** `Then('verify {string} button is available', async ({}, arg: string) => {`
- **Ocurrencias (3):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:14:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:35:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:47:5`

### 43. `And verify the following column headings are displayed and sortable in the Teams table:`

- **Binding sugerido:** `When('verify the following column headings are displayed and sortable in the Teams table:', async ({}, dataTable: DataTable) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:16:5`

### 44. `And try saving the allocation without Team Name`

- **Binding sugerido:** `When('try saving the allocation without Team Name', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:22:5`

### 45. `Then verify warning message displayed as "Team name is required"`

- **Binding sugerido:** `Then('verify warning message displayed as {string}', async ({}, arg: string) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:23:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:21:5`

### 46. `And try saving the allocation without Team Leader`

- **Binding sugerido:** `When('try saving the allocation without Team Leader', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:22:5`

### 47. `And try saving the allocation without Team Member`

- **Binding sugerido:** `When('try saving the allocation without Team Member', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:22:5`

### 48. `And enter a unique name in the "Team Name" field`

- **Binding sugerido:** `When('enter a unique name in the {string} field', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:37:5`

### 49. `And add "TeamMemberRA@outlook.com" on the "Search user" field`

- **Binding sugerido:** `When('add {string} on the {string} field', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:41:5`

### 50. `Then verify the "TeamMemberRA@outlook.com" Team Member is added to the team member table`

- **Binding sugerido:** `Then('verify the {string} Team Member is added to the team member table', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:43:5`

### 51. `Then verify a warning pop up appears with "continue" and "cancel" buttons`

- **Binding sugerido:** `Then('verify a warning pop up appears with {string} and {string} buttons', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:45:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:76:5`

### 52. `When click on "Cancel" button in the confirmation pop up`

- **Binding sugerido:** `When('click on {string} button in the confirmation pop up', async ({}, arg: string) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:46:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:77:5`

### 53. `Then verify the success message is displayed after saving the team`

- **Binding sugerido:** `Then('verify the success message is displayed after saving the team', async ({}) => {`
- **Ocurrencias (5):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:49:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:64:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:74:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:42:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:52:5`

### 54. `And verify the created team details are added to the "Team Management" table`

- **Binding sugerido:** `Then('verify the created team details are added to the {string} table', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:50:5`

### 55. `When click on "Edit" button of the created team in the Teams table`

- **Binding sugerido:** `When('click on {string} button of the created team in the Teams table', async ({}, arg: string) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:51:5`
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:75:5`

### 56. `And add the following Team Members on the "Search user" field:`

- **Binding sugerido:** `When('add the following Team Members on the {string} field:', async ({}, arg: string, dataTable: DataTable) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:54:5`

### 57. `Then verify the following Team Members are added to the team member table:`

- **Binding sugerido:** `Then('verify the following Team Members are added to the team member table:', async ({}, dataTable: DataTable) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:59:5`

### 58. `And verify the new "Client, User" Team Leader is added to the team`

- **Binding sugerido:** `Then('verify the new {string} Team Leader is added to the team', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:65:5`

### 59. `And verify the saved changes are reflected in the team`

- **Binding sugerido:** `Then('verify the saved changes are reflected in the team', async ({}) => {`
- **Ocurrencias (2):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:66:5`
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:44:5`

### 60. `When search for "test.user.1784145920996@gmail.com" in the Team Members table email field`

- **Binding sugerido:** `When('search for {string} in the Team Members table email field', async ({}, arg: string) => {`
- **Ocurrencias (4):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:67:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:74:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:74:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:74:5`

### 61. `Then verify if filters applied`

- **Binding sugerido:** `Then('verify if filters applied', async ({}) => {`
- **Ocurrencias (4):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:68:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:75:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:75:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:75:5`

### 62. `When click on "filter" button from the Team Members table email field`

- **Binding sugerido:** `When('click on {string} button from the Team Members table email field', async ({}, arg: string) => {`
- **Ocurrencias (4):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:69:5`
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:76:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:76:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:76:5`

### 63. `When click on "Delete" icon against the team member "TeamMemberRA@outlook.com"`

- **Binding sugerido:** `When('click on {string} icon against the team member {string}', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:71:5`

### 64. `Then verify the deleted team details are not available in the "Team Management" page`

- **Binding sugerido:** `Then('verify the deleted team details are not available in the {string} page', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_ClientAdminTestCases/TeamManagement_ClientAdmin.feature:78:5`

### 65. `And verify "Update Closed" value is displayed in the "Status" field`

- **Binding sugerido:** `When('verify {string} value is displayed in the {string} field', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (4):**
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:88:5`
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:89:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:70:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:71:5`

### 66. `Then verify only updates that contain "Income" in the title are displayed`

- **Binding sugerido:** `Then('verify only updates that contain {string} in the title are displayed', async ({}, arg: string) => {`
- **Ocurrencias (5):**
  - `features/RA_EXT_ClientUserTestCases/DashboardUpdates_ClientUser.feature:166:5`
  - `features/RA_EXT_TeamLeaderTestCases/DashboardUpdates_TeamLeader.feature:178:5`
  - `features/RA_EXT_TeamMemberTestCases/DashboardUpdates_TeamMember.feature:148:5`
  - `features/RA_INT_DeloitteUserTestCases/DashboardUpdates_DeloitteUser.feature:178:5`
  - `features/RA_INT_SuperAdminTestCases/DashboardUpdates_SuperAdmin.feature:178:5`

### 67. `And verify the following column headings are displayed and sortable in the Teams table:`

- **Binding sugerido:** `Then('verify the following column headings are displayed and sortable in the Teams table:', async ({}, dataTable: DataTable) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:14:5`

### 68. `And try saving the allocation without "Team Name"`

- **Binding sugerido:** `When('try saving the allocation without {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:20:5`

### 69. `When click on "Edit" icon for an existing team`

- **Binding sugerido:** `When('click on {string} icon for an existing team', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:35:5`

### 70. `And add the following Team Members:`

- **Binding sugerido:** `When('add the following Team Members:', async ({}, dataTable: DataTable) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:37:5`

### 71. `And verify the new Team Leader is added to the team`

- **Binding sugerido:** `Then('verify the new Team Leader is added to the team', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:43:5`

### 72. `When search for "test.user.1784145920996@gmail.com" in the Team Members table`

- **Binding sugerido:** `When('search for {string} in the Team Members table', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:45:5`

### 73. `Then verify filters are applied`

- **Binding sugerido:** `Then('verify filters are applied', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:46:5`

### 74. `When click on "clear filter" or "filter" button`

- **Binding sugerido:** `When('click on {string} or {string} button', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:47:5`

### 75. `Then verify the filter is removed and full results are shown`

- **Binding sugerido:** `Then('verify the filter is removed and full results are shown', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:48:5`

### 76. `When click on delete icon against the team member "TeamMemberRA@outlook.com"`

- **Binding sugerido:** `When('click on delete icon against the team member {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:49:5`

### 77. `When click on "Edit" icon for the team`

- **Binding sugerido:** `When('click on {string} icon for the team', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:53:5`

### 78. `And click on "Leave Team"`

- **Binding sugerido:** `When('click on {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:54:5`

### 79. `Then confirm the leave action in the confirmation pop up`

- **Binding sugerido:** `Then('confirm the leave action in the confirmation pop up', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:55:5`

### 80. `Then verify the user is removed from the team (or appropriate confirmation is shown)`

- **Binding sugerido:** `Then('verify the user is removed from the team \\(or appropriate confirmation is shown)', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_EXT_TeamLeaderTestCases/TeamManagement_TeamLeader.feature:56:5`

### 81. `Then verify the user "ra.grewspec@gmail.com" is available in the team leaders`

- **Binding sugerido:** `Then('verify the user {string} is available in the team leaders', async ({}, arg: string) => {`
- **Ocurrencias (3):**
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:73:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:73:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:73:5`

### 82. `When click on "Delete" icon for the team member "DeloitteUserTest@gmail.com"`

- **Binding sugerido:** `When('click on {string} icon for the team member {string}', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (3):**
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:78:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:78:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:78:5`

### 83. `Then verify the deleted team "QA_TEST_01" is not available in the "Team Management" page`

- **Binding sugerido:** `Then('verify the deleted team {string} is not available in the {string} page', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (3):**
  - `features/RA_INT_DeloitteUserTestCases/TeamManagement_DeloitteUser.feature:92:5`
  - `features/RA_INT_PortalAdminTestCases/TeamManagement_PortalAdmin.feature:92:5`
  - `features/RA_INT_SuperAdminTestCases/TeamManagement_SuperAdmin.feature:92:5`

### 84. `Then verify "Portal Test" value is displayed in the "Client Portal Name" field on the "Client Portal Setup" page`

- **Binding sugerido:** `Then('verify {string} value is displayed in the {string} field on the {string} page', async ({}, arg: string, arg1: string, arg2: string) => {`
- **Ocurrencias (4):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:23:5`
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:24:5`
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:25:5`
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:26:5`

### 85. `Then verify the page is navigated to the "Client Portal Setup" step`

- **Binding sugerido:** `Then('verify the page is navigated to the {string} step', async ({}, arg: string) => {`
- **Ocurrencias (3):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:36:5`
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:38:5`
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:41:5`

### 86. `When update the Knowledge Modules & Impact Areas using check-box or "Select All"`

- **Binding sugerido:** `When('update the Knowledge Modules & Impact Areas using check-box or {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:39:5`

### 87. `When update the Jurisdictions selection by removing specific items and making selective configurations`

- **Binding sugerido:** `When('update the Jurisdictions selection by removing specific items and making selective configurations', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:42:5`

### 88. `Then verify the "Deactivate Portal" button is displayed on the client portal setup page toolbar`

- **Binding sugerido:** `Then('verify the {string} button is displayed on the client portal setup page toolbar', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:49:5`

### 89. `And navigate to the deactivated client list at the end of the portal listing`

- **Binding sugerido:** `When('navigate to the deactivated client list at the end of the portal listing', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:54:5`

### 90. `Then verify the deactivated client portal details are displayed`

- **Binding sugerido:** `Then('verify the deactivated client portal details are displayed', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:55:5`

### 91. `And click on the deactivated client portal name in the client portal listing`

- **Binding sugerido:** `Then('click on the deactivated client portal name in the client portal listing', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:56:5`

### 92. `Then verify the error message is displayed on the client portal listing`

- **Binding sugerido:** `Then('verify the error message is displayed on the client portal listing', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:57:5`

### 93. `And verify the portal is displayed in the list and shows status as "Enabled"`

- **Binding sugerido:** `Then('verify the portal is displayed in the list and shows status as {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:62:5`

### 94. `And select the Knowledge Modules & Impact Areas using check-box or "Select All"`

- **Binding sugerido:** `When('select the Knowledge Modules & Impact Areas using check-box or {string}', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:69:5`

### 95. `And select the Jurisdictions by searching a particular state or using check-box`

- **Binding sugerido:** `When('select the Jurisdictions by searching a particular state or using check-box', async ({}) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:71:5`

### 96. `And click on the "01_QA_ClientPortalSetup" client portal name in the client portal listing`

- **Binding sugerido:** `When('click on the {string} client portal name in the client portal listing', async ({}, arg: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:76:5`

### 97. `And press "Open Dashboard" button for the "01_QA_ClientPortalSetup" client portal`

- **Binding sugerido:** `When('press {string} button for the {string} client portal', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:77:5`

### 98. `Then verify the "Add Action" button is "enabled"`

- **Binding sugerido:** `Then('verify the {string} button is {string}', async ({}, arg: string, arg1: string) => {`
- **Ocurrencias (1):**
  - `features/RA_INT_SuperAdminTestCases/ClientPortalSetUp_SuperAdmin.feature:79:5`

