export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function isPositiveNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0;
}

export function isNonNegativeNumber(value) {
  if (value === '' || value === undefined || value === null) return true; // optional charges
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

export function isValidPhone(value) {
  if (!value) return true; // optional
  return /^[+]?[\d\s-]{7,15}$/.test(value.trim());
}

export function isValidGST(value) {
  if (!value) return true; // optional
  return /^[0-9A-Z]{15}$/.test(value.trim().toUpperCase()) || value.trim().length <= 20;
}

// Validates a customer form; returns { valid, errors }
export function validateCustomer(customer) {
  const errors = {};
  if (!isRequired(customer.name)) errors.name = 'Customer name is required';
  if (customer.phone && !isValidPhone(customer.phone)) errors.phone = 'Enter a valid phone number';
  return { valid: Object.keys(errors).length === 0, errors };
}

// Validates a single timber row; returns { valid, errors }
export function validateWoodRow(row) {
  const errors = {};
  if (!isPositiveNumber(row.width)) errors.width = 'Required, > 0';
  if (!isPositiveNumber(row.thickness)) errors.thickness = 'Required, > 0';
  if (!isPositiveNumber(row.length)) errors.length = 'Required, > 0';
  if (!isPositiveNumber(row.quantity)) errors.quantity = 'Required, > 0';
  if (!isNonNegativeNumber(row.rate) || parseFloat(row.rate || 0) <= 0)
    errors.rate = 'Required, > 0';
  return { valid: Object.keys(errors).length === 0, errors };
}

// Validates the whole quotation before saving.
export function validateQuotation(quotation) {
  const errors = {};
  if (!quotation.customerId) errors.customer = 'Please select or add a customer';
  if (!quotation.sections || quotation.sections.length === 0) {
    errors.sections = 'Add at least one wood section';
  } else {
    const hasAnyRow = quotation.sections.some((s) => s.rows && s.rows.length > 0);
    if (!hasAnyRow) errors.sections = 'Add at least one row with measurements';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
