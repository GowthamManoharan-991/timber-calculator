/**
 * password.js
 * ---------------------------------------------------------------------------
 * NOTE: This app currently has no backend, so "authentication" is a
 * client-side convenience layer only - it gates the /admin UI, it does NOT
 * provide real security (anyone with browser devtools access to this device
 * can read Local Storage). Passwords are hashed (SHA-256) rather than
 * stored in plain text so a casual glance at localStorage doesn't reveal
 * them, but this is not a substitute for real auth.
 *
 * FUTURE BACKEND: replace hashPassword()/verifyPassword() with real
 * server-side bcrypt/argon2 hashing + JWT issuance in authService.js. The
 * function signatures here are written so that swap is localized to two
 * files (password.js, authService.js).
 * ---------------------------------------------------------------------------
 */

export async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(plainText, hash) {
  const computed = await hashPassword(plainText);
  return computed === hash;
}
