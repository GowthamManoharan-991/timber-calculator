/**
 * quotationService
 * ---------------------------------------------------------------------------
 * Domain-level API for quotations connected to Hostinger MySQL Backend.
 * ---------------------------------------------------------------------------
 */
import { STORAGE_KEYS, QUOTATION_STATUS } from '../utils/constants';
import { calculateQuotationSummary } from '../utils/calculations';
import { generateId } from '../utils/id';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function withComputedTotals(quotation) {
  const { totalCFT, materialTotal, chargesTotal, grandTotal } = calculateQuotationSummary(quotation || {});
  return { ...quotation, totalCFT, materialTotal, chargesTotal, grandTotal };
}

export const quotationService = {
  /** Fetch all quotations from Hostinger MySQL */
  async getQuotations() {
    try {
      const response = await fetch(`${API_URL}/quotations`);
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const quotations = await response.json();

      return quotations
        .map((q) => ({
          ...q,
          quotationNumber: q.quotation_number || q.quotationNumber,
          customerName:
            q.customer_name ||
            q.customerName ||
            q.customerSnapshot?.name ||
            'Guest Customer',
          totalCFT: parseFloat(q.total_cft || q.totalCFT || 0),
          grandTotal: parseFloat(q.total_amount || q.grandTotal || 0),
          date: q.created_at || q.date || new Date().toISOString(),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error in getQuotations:', error);
      return [];
    }
  },

  /** Fetch a single quotation by ID */
  async getQuotation(id) {
    try {
      const response = await fetch(`${API_URL}/quotations/${id}`);
      if (!response.ok) throw new Error('Quotation not found');
      const q = await response.json();
      return {
        ...q,
        quotationNumber: q.quotation_number || q.quotationNumber,
        customerName:
          q.customer_name ||
          q.customerName ||
          q.customerSnapshot?.name ||
          'Guest Customer',
        customerSnapshot: q.customerSnapshot || {
          name: q.customer_name || q.customerName || 'Guest Customer',
        },
        totalCFT: parseFloat(q.total_cft || q.totalCFT || 0),
        grandTotal: parseFloat(q.total_amount || q.grandTotal || 0),
        sections: q.sections || [],
        additionalCharges: q.additionalCharges || [],
        date: q.created_at || q.date,
      };
    } catch (error) {
      console.error(`Error fetching quotation ${id}:`, error);
      return null;
    }
  },

  /** Generates the next human-readable quotation number */
  async generateQuotationNumber() {
    const year = new Date().getFullYear();
    const quotations = await this.getQuotations();
    const seq = quotations.length + 1;
    return `QTN-${year}-${String(seq).padStart(4, '0')}`;
  },

  /** Creates and saves a new quotation to MySQL database */
  async saveQuotation(quotation) {
    const quotationNumber = quotation.quotationNumber || (await this.generateQuotationNumber());
    const payload = withComputedTotals({
      ...quotation,
      quotationNumber,
      date: quotation.date || new Date().toISOString(),
      status: quotation.status || QUOTATION_STATUS.SAVED,
    });

    const custName =
      payload.customerSnapshot?.name ||
      payload.customerName ||
      payload.customer?.name ||
      'Guest Customer';

    try {
      const response = await fetch(`${API_URL}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotationNumber: payload.quotationNumber,
          customerName: custName,
          totalCft: Number(payload.totalCFT || 0),
          totalAmount: Number(payload.grandTotal || 0),
          fullData: payload, // Stores all sections, rows, dimensions, and customer info
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Server save error:', errText);
        throw new Error('Failed to save quotation to server');
      }

      const savedData = await response.json();
      return { ...payload, id: savedData.id };
    } catch (error) {
      console.error('Error in saveQuotation:', error);
      throw error;
    }
  },

  /** Updates an existing quotation in MySQL database */
  async updateQuotation(id, updates) {
    const existing = await this.getQuotation(id);
    if (!existing) throw new Error('Quotation not found');
    const merged = withComputedTotals({ ...existing, ...updates });

    const custName =
      merged.customerSnapshot?.name ||
      merged.customerName ||
      'Guest Customer';

    try {
      const response = await fetch(`${API_URL}/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: custName,
          totalCft: Number(merged.totalCFT || 0),
          totalAmount: Number(merged.grandTotal || 0),
          fullData: merged,
        }),
      });

      if (!response.ok) throw new Error('Failed to update quotation');
      return merged;
    } catch (error) {
      console.error(`Error updating quotation ${id}:`, error);
      throw error;
    }
  },

  /** Deletes a quotation from MySQL database */
  async deleteQuotation(id) {
    try {
      const response = await fetch(`${API_URL}/quotations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete quotation');
      return true;
    } catch (error) {
      console.error(`Error deleting quotation ${id}:`, error);
      throw error;
    }
  },

  /** Clones a quotation into a fresh draft */
  async duplicateQuotation(id) {
    const original = await this.getQuotation(id);
    if (!original) throw new Error('Quotation not found');
    const quotationNumber = await this.generateQuotationNumber();
    const clone = {
      ...original,
      id: generateId(STORAGE_KEYS.QUOTATIONS),
      quotationNumber,
      date: new Date().toISOString(),
      status: QUOTATION_STATUS.SAVED,
      sections: (original.sections || []).map((s) => ({
        ...s,
        id: generateId('section'),
        rows: (s.rows || []).map((r) => ({ ...r, id: generateId('row') })),
      })),
    };
    return this.saveQuotation(clone);
  },

  /** Search through saved quotations */
  async searchQuotations(query) {
    const quotations = await this.getQuotations();
    if (!query || !query.trim()) return quotations;
    const q = query.trim().toLowerCase();
    return quotations.filter(
      (item) =>
        item.quotation_number?.toLowerCase().includes(q) ||
        item.quotationNumber?.toLowerCase().includes(q) ||
        item.customer_name?.toLowerCase().includes(q) ||
        item.customerName?.toLowerCase().includes(q) ||
        item.customerSnapshot?.name?.toLowerCase().includes(q)
    );
  },
};