/**
 * customerService
 * ---------------------------------------------------------------------------
 * Domain-level API for customers. Pages/components should only ever import
 * from here (never from localStorageService directly) so that swapping the
 * storage engine later is a one-file change.
 *
 * FUTURE BACKEND: replace the body of each function with the equivalent
 * REST call, e.g.:
 *   getCustomers()  -> GET    /api/customers
 *   getCustomer(id) -> GET    /api/customers/:id
 *   addCustomer()   -> POST   /api/customers
 *   updateCustomer()-> PUT    /api/customers/:id
 *   deleteCustomer()-> DELETE /api/customers/:id
 * The function names, params and return shapes are designed to stay stable.
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS } from '../utils/constants';

const COLLECTION = STORAGE_KEYS.CUSTOMERS;

export const customerService = {
  async getCustomers() {
    const customers = await localStorageService.getAll(COLLECTION);
    return customers.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getCustomer(id) {
    return localStorageService.getById(COLLECTION, id);
  },

  async addCustomer(customer) {
    return localStorageService.create(COLLECTION, {
      name: customer.name?.trim(),
      phone: customer.phone?.trim() || '',
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
      gstNumber: customer.gstNumber?.trim() || '',
      notes: customer.notes?.trim() || ''
    });
  },

  async updateCustomer(id, updates) {
    return localStorageService.update(COLLECTION, id, updates);
  },

  async deleteCustomer(id) {
    return localStorageService.remove(COLLECTION, id);
  },

  async searchCustomers(query) {
    const customers = await this.getCustomers();
    if (!query || !query.trim()) return customers;
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }
};
