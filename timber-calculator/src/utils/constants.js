// Central place for constants so services/components never hardcode
// storage keys or option lists inline.

export const STORAGE_KEYS = {
  CUSTOMERS: 'customers',
  QUOTATIONS: 'quotations',
  SETTINGS: 'settings',
  THEME: 'theme',
  QUOTATION_COUNTER: 'quotation_counter',
  USERS: 'users',
  SESSION: 'session',
  RATE_RULES: 'rate_rules'
};

// Role-based access control. ADMIN can access /admin (branding, pricing
// rules, user management); USER is a regular carpenter/biller account.
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export const DEFAULT_WOOD_TYPES = ['Teak', 'Mahogany', 'Neem', 'Rosewood'];

export const CUSTOM_WOOD_TYPE = 'Custom';

// Optional additional charges. `key` maps 1:1 to the quotation.charges object.
export const CHARGE_TYPES = [
  { key: 'planing', label: 'Planing' },
  { key: 'cutting', label: 'Cutting' },
  { key: 'polish', label: 'Polish' },
  { key: 'transport', label: 'Transport' },
  { key: 'labour', label: 'Labour' },
  { key: 'misc', label: 'Miscellaneous' }
];

export const QUOTATION_STATUS = {
  DRAFT: 'draft',
  SAVED: 'saved'
};

export const REPORT_RANGES = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const DEFAULT_SETTINGS = {
  companyName: 'Your Timber Shop',
  logo: '', // base64 data URL
  address: '',
  gstNumber: '',
  phone: '',
  terms: '1. Rates are subject to change without prior notice.\n2. Goods once sold will not be taken back.\n3. Payment due within 7 days of delivery.'
};

export const CURRENCY_SYMBOL = '₹';

// Seed default per-CFT rates so a fresh install has sensible starting
// values. Admins can edit/add to these in Admin > Rate & Pricing Rules.
export const DEFAULT_RATE_RULES = [
  { woodType: 'Teak', defaultRate: 3500 },
  { woodType: 'Mahogany', defaultRate: 2600 },
  { woodType: 'Neem', defaultRate: 1400 },
  { woodType: 'Rosewood', defaultRate: 4200 }
];
