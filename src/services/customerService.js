import { localStorageService } from './localStorageService';
import { STORAGE_KEYS } from '../utils/constants';
import { Customer } from '../types';

const API_BASE_URL = '/api';

export const customerService = {
  // 1. Fetch all customers from Database or Local Cache
  async getCustomers(): Promise<Customer[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/customers`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, data);
          return data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
      }
    } catch (err: any) {
      console.warn('Backend server unreachable or query failed, returning local cache:', err?.message);
    }

    const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
    return localList.sort((a: Customer, b: Customer) => (a.name || '').localeCompare(b.name || ''));
  },

  // 2. Fetch single customer by ID
  async getCustomer(id: number | string): Promise<Customer | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      console.warn(`Could not fetch customer ${id} from API:`, err?.message);
    }
    return await localStorageService.getById(STORAGE_KEYS.CUSTOMERS, id);
  },

  // 3. Add new customer with detailed error handling & seamless fallback
  async addCustomer(customer: Partial<Customer>): Promise<Customer> {
    const payload = {
      name: customer.name?.trim(),
      phone: customer.phone?.trim() || '',
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
      gstNumber: customer.gstNumber?.trim() || (customer as any).gst_number?.trim() || '',
      notes: customer.notes?.trim() || ''
    };

    if (!payload.name) {
      throw new Error('Customer name is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (jsonErr) {
        console.warn('Failed to parse response JSON:', jsonErr);
      }

      if (response.ok && responseData.id) {
        // Keep local cache synced
        const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
        const updatedList = [responseData, ...localList.filter((c: Customer) => String(c.id) !== String(responseData.id))];
        await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, updatedList);
        return responseData;
      }

      // If server returned non-200, extract exact error message
      const serverErrorMsg =
        responseData.message ||
        responseData.error ||
        responseData.sqlError ||
        responseData.details ||
        `Database rejected record (Status ${response.status})`;

      console.warn('Server API rejected insertion:', serverErrorMsg);

      // Fallback to local persistence if DB rejects or fails, so user never loses data!
      const fallbackCustomer: Customer = {
        id: Date.now(),
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        gstNumber: payload.gstNumber,
        notes: payload.notes,
        createdAt: new Date().toISOString()
      };

      const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
      await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, [fallbackCustomer, ...localList]);

      return fallbackCustomer;
    } catch (netErr: any) {
      console.warn('Network or API exception in addCustomer, storing locally:', netErr?.message);

      const fallbackCustomer: Customer = {
        id: Date.now(),
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        gstNumber: payload.gstNumber,
        notes: payload.notes,
        createdAt: new Date().toISOString()
      };

      const localList = (await localStorageService.getAll(STORAGE_KEYS.CUSTOMERS)) || [];
      await localStorageService.setObject(STORAGE_KEYS.CUSTOMERS, [fallbackCustomer, ...localList]);

      return fallbackCustomer;
    }
  },

  // 4. Update customer in MySQL / Local Cache
  async updateCustomer(id: number | string, updates: Partial<Customer>): Promise<any> {
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
    } catch (err: any) {
      console.warn('Backend update failed, updating local cache:', err?.message);
    }

    return await localStorageService.update(STORAGE_KEYS.CUSTOMERS, id, updates);
  },

  // 5. Delete customer
  async deleteCustomer(id: number | string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      console.warn('Backend delete failed, removing locally:', err?.message);
    }

    return await localStorageService.removeItemById(STORAGE_KEYS.CUSTOMERS, id);
  },

  // 6. Search customers
  async searchCustomers(query: string): Promise<Customer[]> {
    const customers = await this.getCustomers();
    if (!query || !query.trim()) return customers;
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q)
    );
  }
};
