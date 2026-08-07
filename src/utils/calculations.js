// Pure calculation helpers - no side effects, easy to unit test.
// Formulae:
//   CFT    = (Width(in) x Thickness(in) x Length(ft) x Quantity) / 144
//   Amount = CFT x Rate per CFT

const n = (v) => {
  const num = parseFloat(v);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

export function calculateRowCFT(row) {
  const { width, thickness, length, quantity } = row;
  return (n(width) * n(thickness) * n(length) * n(quantity)) / 144;
}

export function calculateRowAmount(row) {
  const cft = calculateRowCFT(row);
  return cft * n(row.rate);
}

export function calculateSectionTotals(section) {
  const rows = section?.rows || [];
  return rows.reduce(
    (acc, row) => {
      acc.totalCFT += calculateRowCFT(row);
      acc.totalAmount += calculateRowAmount(row);
      return acc;
    },
    { totalCFT: 0, totalAmount: 0 }
  );
}

export function calculateMaterialTotal(sections = []) {
  return sections.reduce((sum, section) => sum + calculateSectionTotals(section).totalAmount, 0);
}

export function calculateTotalCFT(sections = []) {
  return sections.reduce((sum, section) => sum + calculateSectionTotals(section).totalCFT, 0);
}

export function calculateChargesTotal(charges = {}) {
  return Object.values(charges).reduce((sum, val) => sum + n(val), 0);
}

export function calculateGrandTotal(sections = [], charges = {}) {
  return calculateMaterialTotal(sections) + calculateChargesTotal(charges);
}

export function calculateQuotationSummary(quotation) {
  const sections = quotation?.sections || [];
  const charges = quotation?.charges || {};
  const materialTotal = calculateMaterialTotal(sections);
  const chargesTotal = calculateChargesTotal(charges);
  return {
    totalCFT: calculateTotalCFT(sections),
    materialTotal,
    chargesTotal,
    grandTotal: materialTotal + chargesTotal
  };
}
