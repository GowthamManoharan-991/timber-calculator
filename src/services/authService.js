/**
 * authService
 * ---------------------------------------------------------------------------
 * Client-side session management for the current single-device app. Stores
 * only the logged-in user's id in localStorage (never the password/hash).
 *
 * FUTURE BACKEND: login() -> POST /api/auth/login, returning a JWT that
 * gets stored (e.g. in memory + httpOnly cookie, or localStorage depending
 * on your threat model) instead of a raw user id; getCurrentUser() would
 * decode/validate that token instead of re-reading localStorage. The
 * function names (login, logout, getCurrentUser) are designed to stay the
 * same so AuthContext doesn't need to change.
 * ---------------------------------------------------------------------------
 */
import { localStorageService } from './localStorageService';
import { userService } from './userService';
import { STORAGE_KEYS } from '../utils/constants';
import { verifyPassword } from '../utils/password';

const SESSION_KEY = STORAGE_KEYS.SESSION;

export const authService = {
  /** Attempts to log in; returns the sanitized user on success, throws on failure. */
  async login(username, password) {
    const user = await userService.findByUsername(username);
    if (!user || !user.active) {
      throw new Error('Invalid username or password');
    }
    const ok = await verifyPassword(password || '', user.passwordHash);
    if (!ok) {
      throw new Error('Invalid username or password');
    }
    await localStorageService.setObject(SESSION_KEY, { userId: user.id });
    const { passwordHash, ...safeUser } = user; // eslint-disable-line no-unused-vars
    return safeUser;
  },

  async logout() {
    await localStorageService.setObject(SESSION_KEY, null);
  },

  /** Returns the currently logged-in (sanitized) user, or null. */
  async getCurrentUser() {
    const session = await localStorageService.getObject(SESSION_KEY, null);
    if (!session?.userId) return null;
    const user = await userService.getUser(session.userId);
    if (!user || !user.active) return null;
    return user;
  }
};
