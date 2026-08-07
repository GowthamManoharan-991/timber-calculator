import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { customerService } from '../services/customerService';
import { quotationService } from '../services/quotationService';
import { settingsService } from '../services/settingsService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCustomers = useCallback(async () => {
    const data = await customerService.getCustomers();
    setCustomers(data);
    return data;
  }, []);

  const refreshQuotations = useCallback(async () => {
    const data = await quotationService.getQuotations();
    setQuotations(data);
    return data;
  }, []);

  const refreshSettings = useCallback(async () => {
    const data = await settingsService.getSettings();
    setSettings(data);
    return data;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([refreshCustomers(), refreshQuotations(), refreshSettings()]);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load application data');
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshCustomers, refreshQuotations, refreshSettings]);

  // ---- Customer actions -----------------------------------------------
  const addCustomer = useCallback(
    async (customer) => {
      const created = await customerService.addCustomer(customer);
      await refreshCustomers();
      return created;
    },
    [refreshCustomers]
  );

  const editCustomer = useCallback(
    async (id, updates) => {
      const updated = await customerService.updateCustomer(id, updates);
      await refreshCustomers();
      return updated;
    },
    [refreshCustomers]
  );

  const removeCustomer = useCallback(
    async (id) => {
      await customerService.deleteCustomer(id);
      await refreshCustomers();
    },
    [refreshCustomers]
  );

  // ---- Quotation actions ------------------------------------------------
  const saveQuotation = useCallback(
    async (quotation) => {
      const created = await quotationService.saveQuotation(quotation);
      await refreshQuotations();
      return created;
    },
    [refreshQuotations]
  );

  const editQuotation = useCallback(
    async (id, updates) => {
      const updated = await quotationService.updateQuotation(id, updates);
      await refreshQuotations();
      return updated;
    },
    [refreshQuotations]
  );

  const removeQuotation = useCallback(
    async (id) => {
      await quotationService.deleteQuotation(id);
      await refreshQuotations();
    },
    [refreshQuotations]
  );

  const duplicateQuotation = useCallback(
    async (id) => {
      const clone = await quotationService.duplicateQuotation(id);
      await refreshQuotations();
      return clone;
    },
    [refreshQuotations]
  );

  // ---- Settings actions ---------------------------------------------------
  const updateSettings = useCallback(async (newSettings) => {
    const saved = await settingsService.saveSettings(newSettings);
    setSettings(saved);
    return saved;
  }, []);

  const value = useMemo(
    () => ({
      customers,
      quotations,
      settings,
      loading,
      error,
      refreshCustomers,
      refreshQuotations,
      refreshSettings,
      addCustomer,
      editCustomer,
      removeCustomer,
      saveQuotation,
      editQuotation,
      removeQuotation,
      duplicateQuotation,
      updateSettings
    }),
    [
      customers,
      quotations,
      settings,
      loading,
      error,
      refreshCustomers,
      refreshQuotations,
      refreshSettings,
      addCustomer,
      editCustomer,
      removeCustomer,
      saveQuotation,
      editQuotation,
      removeQuotation,
      duplicateQuotation,
      updateSettings
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
