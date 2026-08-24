import { Logger } from './Logger';

/**
 * Definition of a required environment variable.
 */
interface EnvRule {
  /** Variable name */
  name: string;
  /** Description used in the error message */
  description?: string;
  /** If true, always required. Otherwise, validated only when `condition` is met */
  required?: boolean;
  /** Validation condition: function that receives process.env and returns a boolean */
  condition?: (env: NodeJS.ProcessEnv) => boolean;
}

/**
 * Environment variable validator.
 *
 * Verifies at startup that all required variables are defined
 * and displays clear messages identifying missing variables.
 *
 * Uso:
 * ```ts
 * import { EnvValidator } from '../utils/EnvValidator';
 *
 * // Validate basic variables
 * EnvValidator.validateRequired();
 *
 * // Validate custom rules
 * EnvValidator.validate([
 *   { name: 'MY_API_KEY', description: 'Service X API key', required: true },
 *   { name: 'SPECIAL_TOKEN', description: 'Only for @special tests',
 *     condition: (env) => env.TAG === 'special' },
 * ]);
 * ```
 */
export class EnvValidator {

  /** Variables always required to run the framework */
  private static readonly BASE_RULES: EnvRule[] = [
    { name: 'ENV', description: 'Execution environment (DEV/STAGE)', required: true },
  ];

  /** Variables required by environment */
  private static readonly URL_RULES: EnvRule[] = [
    {
      name: 'DEV_URL',
      description: 'Development environment URL',
      condition: (env) => env.ENV === 'DEV',
    },
    {
      name: 'STAGE_URL',
      description: 'STAGE environment URL',
      condition: (env) => env.ENV === 'STAGE',
    },
  ];

  /**
  * Validates the framework's basic environment variables.
  * Throws an error listing all missing variables.
   *
  * @param warnOnly If true, logs warnings instead of throwing an error
   */
  static validateRequired(warnOnly = false): void {
    const allRules = [
      ...this.BASE_RULES,
      ...this.URL_RULES,
    ];
    this.validate(allRules, warnOnly);
  }

  /**
  * Validates a custom set of rules.
   *
  * @param rules Array of rules to validate
  * @param warnOnly If true, logs warnings only
   */
  static validate(rules: EnvRule[], warnOnly = false): void {
    const log = Logger.getInstance();
    const missing: string[] = [];

    for (const rule of rules) {
      const shouldCheck = rule.required || (rule.condition ? rule.condition(process.env) : true);
      if (!shouldCheck) continue;

      const value = process.env[rule.name];
      if (!value || value.trim() === '') {
        const desc = rule.description ? ` (${rule.description})` : '';
        missing.push(`  - ${rule.name}${desc}`);
      }
    }

    if (missing.length === 0) return;

    const header = `Missing ${missing.length} environment variable(s):`;
    const detail = missing.join('\n');
    const hint = 'Configure these variables in the .env file or in Azure DevOps pipeline variables.';
    const fullMessage = `${header}\n${detail}\n${hint}`;

    if (warnOnly) {
      log.warn(fullMessage);
    } else {
      log.error(fullMessage);
      throw new Error(fullMessage);
    }
  }

}
