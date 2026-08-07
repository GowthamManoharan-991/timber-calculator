// Generates a reasonably unique id without extra dependencies.
// When the backend arrives, server-generated (auto-increment / UUID) ids
// will simply flow through the same service layer unchanged.
export function generateId(prefix = '') {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${random}` : random;
}
