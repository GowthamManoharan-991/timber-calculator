/**
 * customerService
 * ---------------------------------------------------------------------------
 * Domain-level API for customers powered by live Database REST API endpoints.
 * All operations fetch directly from and write to the central server.
 * ---------------------------------------------------------------------------
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const customerService = {
  // 1. Fetch all customers from Database
  async getCustomers() {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers from database');
      const customers = await response.json();
      return customers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (err) {
      console.error('Error fetching customers from database:', err);
      return [];
    }
  },

  // 2. Fetch single customer by ID
  async getCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (!response.ok) throw new Error('Customer not found in database');
      return await response.json();
    } catch (err) {
      console.error(`Error fetching customer ${id}:`, err);
      return null;
    }
  },

  // 3. Add new customer to Database
  async addCustomer(customer) {
    const payload = {
      name: customer.name?.trim(),
      phone: customer.phone?.trim() || '',
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
      gstNumber: customer.gstNumber?.trim() || '',
      notes: customer.notes?.trim() || ''
    };

    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to save customer to database');
    }

    return await response.json();
  },

  // 4. Update existing customer in Database
  async updateCustomer(id, updates) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update customer in database');
    }

    return await response.json();
  },

  // 5. Delete customer from Database
  async deleteCustomer(id) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete customer from database');
    }

    return true;
  },

  // 6. Search customers from live Database
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