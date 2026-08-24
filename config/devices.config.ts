import { devices } from '@playwright/test';

/**
 * Configuration for the only device supported by the application.
 */

export interface DeviceProfile {
  name: string;
  viewport: { width: number; height: number };
}

/**
 * Available desktop profile.
 */
export const DEVICE_PROFILES: Record<string, DeviceProfile> = {
  desktop: {
    name: 'Desktop Chrome HD',
    viewport: { width: 1280, height: 720 },
  },
};


