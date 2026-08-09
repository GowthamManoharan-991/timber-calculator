/**
 * customerService
 * ---------------------------------------------------------------------------
 * Domain-level API for Customers connected directly to the MySQL database REST API.
 * Uses localStorageService as a local cache.
 * ---------------------------------------------------------------------------
 */

import { localStorageService } from './localStorageService';
import { STORAGE_KEYS } from '../utils/constants';

// Hardcode your live Render API URL here
const API_BASE_URL = 'https://timber-server-6kdv.onrender.com/api';

export const customerService = {
  // 1. Fetch all customers from MySQL Database
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
      console.warn('Backend server offline or unreachable, returning local cache:', err.message);
    }

    const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
    return localList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  },

  // 2. Fetch single customer by ID
  async getCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`Could not fetch customer ${id} from API:`, err.message);
    }
    return await localStorageService.getById(STORAGE_KEYS.CUSTOMERS, id);
  },

  // 3. Add new customer directly to MySQL Database
  async addCustomer(customer) {
    const payload = {
      name: customer.name?.trim(),
      phone: customer.phone?.trim() || '',
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
      gstNumber: customer.gstNumber?.trim() || customer.gst_number?.trim() || '',
      notes: customer.notes?.trim() || ''
    };

    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const serverError = responseData.message || responseData.error || responseData.sqlError || 'Database rejected customer record';
      throw new Error(serverError);
    }

    // Keep local cache synced
    const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
    await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, [responseData, ...localList]);

    return responseData;
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
      console.warn('Backend update failed, updating local cache:', err.message);
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