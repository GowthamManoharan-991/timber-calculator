/**
 * customerService
 * ---------------------------------------------------------------------------
 * Domain-level API for Customers powered by the central MySQL database REST API.
 * Uses localStorage as an offline cache fallback.
 * ---------------------------------------------------------------------------
 */

import { localStorageService } from './localStorageService';
import { STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const customerService = {
  // 1. Get all customers from MySQL Database
  async getCustomers() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/customers`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, data);
        return Array.isArray(data) ? data.sort((a, b) => (a.name || '').localeCompare(b.name || '')) : [];
      }
    } catch (err) {
      console.warn('Backend server offline/unreachable, loading local cached customers:', err.message);
    }

    const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
    return localList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  },

  // 2. Get single customer by ID
  async getCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`Could not fetch customer ${id} from API, checking local storage:`, err.message);
    }
    return await localStorageService.getById(STORAGE_KEYS.CUSTOMERS, id);
  },

  // 3. Add new customer to MySQL Database
  async addCustomer(customer) {
    const payload = {
      name: customer.name?.trim(),
      phone: customer.phone?.trim() || '',
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
      gstNumber: customer.gstNumber?.trim() || customer.gst_number?.trim() || '',
      notes: customer.notes?.trim() || ''
    };

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
        await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, [responseData, ...localList]);
        return responseData;
      }

      throw new Error(responseData.message || responseData.error || 'Database rejected customer record');
    } catch (err) {
      console.warn('Backend save failed:', err.message);
      throw err;
    }
  },

  // 4. Update customer in MySQL Database
  async updateCustomer(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const result = await response.json();
        await localStorageService.update(STORAGE_KEYS.CUSTOMERS, id, updates);
        return result;
      }
    } catch (err) {
      console.warn('Backend update failed, updating local storage:', err.message);
    }

    return await localStorageService.update(STORAGE_KEYS.CUSTOMERS, id, updates);
  },

  // 5. Delete customer from MySQL Database
  async deleteCustomer(id) {
    try {
      await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend delete failed, removing locally:', err.message);
    }

    return await localStorageService.remove(STORAGE_KEYS.CUSTOMERS, id);
  },

  // 6. Search customers
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