import { clearAuthStates } from '../utils/AuthStateManager';

export default async function authStateTeardown(): Promise<void> {
  await clearAuthStates();
}