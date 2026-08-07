/**
 * rateRuleService
 * ---------------------------------------------------------------------------
 * Domain-level API for default per-CFT rate rules, configured by Admin >
 * Rate & Pricing Rules and consumed by the Calculator to pre-fill the Rate
 * field for new rows (carpenters can still override per row).
 *
 * FUTURE BACKEND mapping:
 *   getRateRules() -> GET    /api/rate-rules
 *   saveRateRule() -> POST   /api/rate-rules | PUT /api/rate-rules/:id
 *   deleteRateRule() -> DELETE /api/rate-rules/:id
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, DEFAULT_RATE_RULES } from '../utils/constants';

const COLLECTION = STORAGE_KEYS.RATE_RULES;

async function ensureSeeded() {
  const existing = await localStorageService.getAll(COLLECTION);
  if (existing.length > 0) return;
  for (const rule of DEFAULT_RATE_RULES) {
    await localStorageService.create(COLLECTION, rule);
  }
}

export const rateRuleService = {
  async getRateRules() {
    await ensureSeeded();
    const rules = await localStorageService.getAll(COLLECTION);
    return rules.sort((a, b) => a.woodType.localeCompare(b.woodType));
  },

  async getRateForWoodType(woodType) {
    const rules = await this.getRateRules();
    const match = rules.find((r) => r.woodType.toLowerCase() === (woodType || '').toLowerCase());
    return match ? match.defaultRate : null;
  },

  async addRateRule({ woodType, defaultRate }) {
    return localStorageService.create(COLLECTION, {
      woodType: woodType?.trim(),
      defaultRate: Number(defaultRate) || 0
    });
  },

  async updateRateRule(id, updates) {
    return localStorageService.update(COLLECTION, id, {
      ...updates,
      defaultRate: updates.defaultRate !== undefined ? Number(updates.defaultRate) || 0 : undefined
    });
  },

  async deleteRateRule(id) {
    return localStorageService.remove(COLLECTION, id);
  }
};
