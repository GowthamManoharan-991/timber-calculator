/**
 * userService
 * ---------------------------------------------------------------------------
 * Domain-level API for user accounts (used by Admin > User Management and
 * by authService for login). Same pattern as the other domain services:
 * everything goes through localStorageService today, and can be repointed
 * at REST endpoints later without touching components.
 *
 * FUTURE BACKEND mapping:
 *   getUsers()     -> GET    /api/users        (admin only)
 *   addUser()      -> POST   /api/users        (admin only)
 *   updateUser()   -> PUT    /api/users/:id    (admin only)
 *   deleteUser()   -> DELETE /api/users/:id    (admin only)
 *   findByUsername() -> handled server-side during login, not exposed as an
 *                       endpoint at all in a real backend.
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { STORAGE_KEYS, ROLES } from '../utils/constants';
import { hashPassword } from '../utils/password';

const COLLECTION = STORAGE_KEYS.USERS;

const DEFAULT_ADMIN = {
  name: 'Administrator',
  username: 'Aazhi_19',
  email: '',
  role: ROLES.ADMIN,
  active: true
};
const DEFAULT_ADMIN_PASSWORD = 'Muruga_26';

/** Creates a default admin account on first run or wipes legacy default accounts. */
async function ensureSeeded() {
  const existing = await localStorageService.getAll(COLLECTION);

  // Check if the old 'admin' user is present in local storage
  const hasLegacyAdmin = existing.some(
    (u) => u.username && u.username.toLowerCase() === 'admin'
  );

  // If local storage has no users OR contains the old legacy admin, purge and seed fresh
  if (existing.length === 0 || hasLegacyAdmin) {
    if (hasLegacyAdmin) {
      // Clear out stored legacy users and active session
      await localStorageService.setAll(COLLECTION, []);
      await localStorageService.setObject(STORAGE_KEYS.SESSION, null);
    }

    const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
    await localStorageService.create(COLLECTION, { ...DEFAULT_ADMIN, passwordHash });
  }
}

function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user; // eslint-disable-line no-unused-vars
  return safe;
}

export const userService = {
  /** Returns users without password hashes (safe to render in the UI). */
  async getUsers() {
    await ensureSeeded();
    const users = await localStorageService.getAll(COLLECTION);
    return users.map(sanitize).sort((a, b) => a.name.localeCompare(b.name));
  },

  /** Internal: used only by authService during login. Includes the hash. */
  async findByUsername(username) {
    await ensureSeeded();
    const users = await localStorageService.getAll(COLLECTION);
    return users.find((u) => u.username.toLowerCase() === (username || '').trim().toLowerCase()) || null;
  },

  async getUser(id) {
    const user = await localStorageService.getById(COLLECTION, id);
    return sanitize(user);
  },

  async addUser({ name, username, email, role, password }) {
    const existing = await this.findByUsername(username);
    if (existing) throw new Error('That username is already taken');
    const passwordHash = await hashPassword(password);
    const created = await localStorageService.create(COLLECTION, {
      name: name?.trim(),
      username: username?.trim(),
      email: email?.trim() || '',
      role: role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER,
      active: true,
      passwordHash
    });
    return sanitize(created);
  },

  async updateUser(id, updates) {
    const patch = { ...updates };
    if (patch.password) {
      patch.passwordHash = await hashPassword(patch.password);
    }
    delete patch.password;
    const updated = await localStorageService.update(COLLECTION, id, patch);
    return sanitize(updated);
  },

  async deleteUser(id) {
    return localStorageService.remove(COLLECTION, id);
  }
};