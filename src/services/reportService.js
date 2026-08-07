/**
 * reportService
 * ---------------------------------------------------------------------------
 * Aggregates saved quotations into sales reports. Runs entirely client-side
 * against whatever quotationService returns, so it works unmodified whether
 * the data source is localStorage or a future REST API.
 * ---------------------------------------------------------------------------
 */
import { quotationService } from './quotationService';
import { REPORT_RANGES } from '../utils/constants';

function bucketKey(dateStr, range) {
  const d = new Date(dateStr);
  if (range === REPORT_RANGES.DAILY) {
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  if (range === REPORT_RANGES.MONTHLY) {
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }
  return String(d.getFullYear());
}

function inRange(dateStr, range, referenceDate) {
  const d = new Date(dateStr);
  const ref = referenceDate ? new Date(referenceDate) : new Date();
  if (range === REPORT_RANGES.DAILY) {
    return d.toDateString() === ref.toDateString();
  }
  if (range === REPORT_RANGES.MONTHLY) {
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }
  return d.getFullYear() === ref.getFullYear();
}

export const reportService = {
  /**
   * Returns aggregate totals for a given range ('daily' | 'monthly' | 'yearly')
   * plus a breakdown grouped by bucket, for charting/tables.
   */
  async getReport(range = REPORT_RANGES.MONTHLY, referenceDate = new Date().toISOString()) {
    const all = await quotationService.getQuotations();
    const filtered = all.filter((q) => inRange(q.date, range, referenceDate));

    const totals = filtered.reduce(
      (acc, q) => {
        acc.totalSales += q.grandTotal || 0;
        acc.totalCFT += q.totalCFT || 0;
        acc.totalLabour += q.charges?.labour ? Number(q.charges.labour) : 0;
        acc.totalRevenue += q.grandTotal || 0;
        acc.totalQuotations += 1;
        return acc;
      },
      { totalSales: 0, totalCFT: 0, totalLabour: 0, totalRevenue: 0, totalQuotations: 0 }
    );

    const bucketsMap = new Map();
    filtered.forEach((q) => {
      const key = bucketKey(q.date, range === REPORT_RANGES.YEARLY ? REPORT_RANGES.MONTHLY : REPORT_RANGES.DAILY);
      const existing = bucketsMap.get(key) || { key, sales: 0, cft: 0, count: 0 };
      existing.sales += q.grandTotal || 0;
      existing.cft += q.totalCFT || 0;
      existing.count += 1;
      bucketsMap.set(key, existing);
    });

    const breakdown = Array.from(bucketsMap.values()).sort((a, b) => (a.key > b.key ? 1 : -1));

    return { range, totals, breakdown, quotations: filtered };
  }
};
