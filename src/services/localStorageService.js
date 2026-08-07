/**
 * localStorageService
 * ---------------------------------------------------------------------------
 * Generic, promise-based data access layer backed by window.localStorage.
 *
 * WHY PROMISES: every method returns a Promise, exactly like a `fetch()` call
 * would. This means domain services (customerService, quotationService, ...)
 * and the components that call them are already written against an
 * asynchronous contract. When the Node.js + Express + MySQL backend is ready,
 * this file can be replaced with an `apiService.js` that implements the same
 * method names (getAll, getById, create, update, remove, getObject, setObject)
 * using `fetch()`/axios instead of localStorage — no other file has to change.
 *
 * DATA SHAPE: each "collection" (customers, quotations, ...) is stored as a
 * JSON array under a prefixed key. Singleton data (settings) is stored as a
 * plain object via getObject/setObject.
 * ---------------------------------------------------------------------------
 */

import { generateId } from '../utils/id';

const STORAGE_PREFIX = 'timbercalc_';

// A tiny artificial delay keeps UI loading states honest and makes the
// eventual swap to real network calls behave the same way.
const NETWORK_DELAY_MS = 120;
const delay = (ms = NETWORK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function keyFor(collection) {
  return `${STORAGE_PREFIX}${collection}`;
}

function safeParse(raw, fallback) {
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[localStorageService] Failed to parse stored value:`, error);
    return fallback;
  }
}

function readArray(collection) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const raw = window.localStorage.getItem(keyFor(collection));
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function writeArray(collection, items) {
  try {
    window.localStorage.setItem(keyFor(collection), JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(`[localStorageService] Failed to write "${collection}":`, error);
    throw new StorageError('Could not save data. Your browser storage may be full.');
  }
}

export class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageError';
  }
}

export const localStorageService = {
  /** Fetch every record in a collection. */
  async getAll(collection) {
    await delay();
    return readArray(collection);
  },

  /** Fetch a single record by id, or null if not found. */
  async getById(collection, id) {
    await delay();
    const items = readArray(collection);
    return items.find((item) => item.id === id) || null;
  },

  /** Create a new record. Auto-assigns id + timestamps if not provided. */
  async create(collection, data) {
    await delay();
    const items = readArray(collection);
    const now = new Date().toISOString();
    const record = {
      id: data.id || generateId(collection),
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now
    };
    items.push(record);
    writeArray(collection, items);
    return record;
  },

  /** Update an existing record by id (shallow merge). Throws if not found. */
  async update(collection, id, updates) {
    await delay();
    const items = readArray(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new StorageError(`Record not found in "${collection}" (id: ${id})`);
    }
    const updated = { ...items[index], ...updates, id, updatedAt: new Date().toISOString() };
    items[index] = updated;
    writeArray(collection, items);
    return updated;
  },

  /** Delete a record by id. Returns true if a record was removed. */
  async remove(collection, id) {
    await delay();
    const items = readArray(collection);
    const next = items.filter((item) => item.id !== id);
    writeArray(collection, next);
    return next.length !== items.length;
  },

  /** Replace an entire collection at once (used for imports/bulk edits). */
  async setAll(collection, items) {
    await delay();
    writeArray(collection, items || []);
    return items || [];
  },

  /** Read a singleton object (e.g. settings). */
  async getObject(key, fallback = {}) {
    await delay();
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(keyFor(key));
    return safeParse(raw, fallback);
  },

  /** Write a singleton object (e.g. settings). */
  async setObject(key, value) {
    await delay();
    try {
      window.localStorage.setItem(keyFor(key), JSON.stringify(value));
      return value;
    } catch (error) {
      console.error(`[localStorageService] Failed to write object "${key}":`, error);
      throw new StorageError('Could not save data. Your browser storage may be full.');
    }
  },

  /** Increment and return a simple numeric counter (used for quotation numbers). */
  async nextSequence(key) {
    await delay(0);
    const current = safeParse(window.localStorage.getItem(keyFor(key)), 0) || 0;
    const next = current + 1;
    window.localStorage.setItem(keyFor(key), JSON.stringify(next));
    return next;
  },

  /** Remove every key belonging to this app (used by a future "reset app" action). */
  async clearAll() {
    await delay();
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
    return true;
  }
};
