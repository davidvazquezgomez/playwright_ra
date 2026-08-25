import { After } from './fixtures';

type CleanupAction = () => Promise<void>;

const cleanupActionsKey = 'scenarioCleanupActions';

/**
 * Registers a cleanup action to run when a scenario marked with @cleanup finishes.
 */
export function registerScenarioCleanup(
  testData: Record<string, unknown>,
  cleanupAction: CleanupAction,
): void {
  const cleanupActions = (testData[cleanupActionsKey] as CleanupAction[] | undefined) ?? [];
  cleanupActions.push(cleanupAction);
  testData[cleanupActionsKey] = cleanupActions;
}

After({ name: 'Clean up scenario resources', tags: '@cleanup' }, async ({ testData }) => {
  const cleanupActions = (testData[cleanupActionsKey] as CleanupAction[] | undefined) ?? [];
  const cleanupErrors: Error[] = [];

  for (const cleanupAction of [...cleanupActions].reverse()) {
    try {
      await cleanupAction();
    } catch (error) {
      cleanupErrors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  if (cleanupErrors.length > 0) {
    throw new Error(
      `Scenario cleanup failed: ${cleanupErrors.map(error => error.message).join(' | ')}`,
    );
  }
});