import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

export const settingsService = {
  async getSettings() {
    const settings = await localStorageService.getObject(STORAGE_KEYS.SETTINGS, null);
    // Always fall back to default shop details if local storage is empty
    return settings ? { ...DEFAULT_SETTINGS, ...settings } : { ...DEFAULT_SETTINGS };
  },

  async saveSettings(settings) {
    const updated = { ...DEFAULT_SETTINGS, ...settings };
    await localStorageService.setObject(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }
};