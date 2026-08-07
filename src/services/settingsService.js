/**
 * settingsService
 * ---------------------------------------------------------------------------
 * Domain-level API for the single company-settings record.
 * FUTURE BACKEND: getSettings() -> GET /api/settings, saveSettings() -> PUT /api/settings
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

export const settingsService = {
  async getSettings() {
    const settings = await localStorageService.getObject(STORAGE_KEYS.SETTINGS, null);
    return settings ? { ...DEFAULT_SETTINGS, ...settings } : { ...DEFAULT_SETTINGS };
  },

  async saveSettings(settings) {
    return localStorageService.setObject(STORAGE_KEYS.SETTINGS, settings);
  }
};
