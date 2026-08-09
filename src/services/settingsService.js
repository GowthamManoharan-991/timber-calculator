/**
 * settingsService
 * ---------------------------------------------------------------------------
 * Domain-level API for the single company-settings record.
 * Uses localStorage for instant offline access and syncs with the remote API
 * when available.
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const settingsService = {
  async getSettings() {
    // 1. Get local cached data immediately
    const localSettings = await localStorageService.getObject(STORAGE_KEYS.SETTINGS, null);

    // 2. Try fetching updated settings from the backend with a fast timeout (2.5s)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${API_BASE_URL}/settings`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const remoteSettings = await response.json();
        const merged = { ...DEFAULT_SETTINGS, ...remoteSettings };
        // Cache the updated remote settings locally
        await localStorageService.setObject(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch (err) {
      console.warn('Backend unavailable or slow, loading local settings:', err.message);
    }

    // 3. Fallback to local storage or defaults
    return localSettings ? { ...DEFAULT_SETTINGS, ...localSettings } : { ...DEFAULT_SETTINGS };
  },

  async saveSettings(settings) {
    const updated = { ...DEFAULT_SETTINGS, ...settings };

    // Save locally immediately
    await localStorageService.setObject(STORAGE_KEYS.SETTINGS, updated);

    // Attempt to sync to the remote backend server
    try {
      await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Could not sync settings to remote server:', err.message);
    }

    return updated;
  }
};