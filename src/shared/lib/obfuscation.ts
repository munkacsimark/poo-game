/**
 * Building blocks for obfuscated, tamper-evident data (exported profile files, sealed storage).
 * This deters casual reading and editing; it isn't security, because every key ships in the
 * app bundle.
 */

export type Bytes = Uint8Array<ArrayBuffer>;

/** Base64url without padding, via the widely supported btoa/atob. */
export const toBase64Url = (bytes: Bytes): string =>
  btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");

/** Throws on characters outside the base64url alphabet. */
export const fromBase64Url = (text: string): Bytes => {
  const binary = atob(text.replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
};

/**
 * XORs `bytes` with an xorshift32 key stream seeded from `secret` and `salt`. Applying it twice
 * with the same inputs restores the original bytes.
 */
export const scramble = (bytes: Bytes, secret: Bytes, salt: Bytes): Bytes => {
  let state = 0x9e_37_79_b9;
  for (const byte of [...secret, ...salt]) state = Math.imul(state ^ byte, 0x01_00_01_93);
  return bytes.map((byte) => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return byte ^ (state & 0xff);
  });
};

export const sameBytes = (a: Bytes, b: Bytes): boolean =>
  a.length === b.length && a.every((byte, index) => byte === b[index]);
