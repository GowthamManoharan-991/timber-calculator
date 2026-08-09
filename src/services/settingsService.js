/**
 * settingsService
 * ---------------------------------------------------------------------------
 * Domain-level API for company settings.
 * Prioritizes local storage for instant saves and offline persistence.
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const settingsService = {
  async getSettings() {
    // 1. Read from localStorage first
    const localSettings = await localStorageService.getObject(STORAGE_KEYS.SETTINGS, null);

    // 2. Safely attempt to fetch remote settings without overriding if backend fails
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(`${API_BASE_URL}/settings`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const remoteSettings = await response.json();
        if (remoteSettings && Object.keys(remoteSettings).length > 0) {
          const merged = { ...DEFAULT_SETTINGS, ...localSettings, ...remoteSettings };
          await localStorageService.setObject(STORAGE_KEYS.SETTINGS, merged);
          return merged;
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using stored settings:', err.message);
    }

    // 3. Fallback to saved local data or default configuration
    return localSettings ? { ...DEFAULT_SETTINGS, ...localSettings } : { ...DEFAULT_SETTINGS };
  },

  async saveSettings(settings) {
    const updated = { ...DEFAULT_SETTINGS, ...settings };

    // 1. Instantly save to local storage (guarantees persistence across refreshes)
    await localStorageService.setObject(STORAGE_KEYS.SETTINGS, updated);

    // 2. Silently attempt backend sync
    try {
      await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Could not sync settings to backend API:', err.message);
    }

    return updated;
  }
};