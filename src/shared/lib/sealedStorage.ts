import { fromBase64Url, sameBytes, scramble, toBase64Url, type Bytes } from "./obfuscation";

/**
 * localStorage values that players can't casually read or edit: JSON, XOR-scrambled with a
 * salted key stream, tagged with a keyed checksum and base64url-encoded behind a format prefix.
 * Any edit breaks the checksum and the value reads as missing. It's synchronous (unlike profile
 * files) because the app reads storage while rendering its first frame.
 *
 * Deterrence, not security: the key ships with the app.
 *
 * Layout: "PGS1" + base64url(salt[4] ‖ checksum[8] ‖ scrambled JSON)
 * To change the format, add "PGS2" and keep reading "PGS1" so no one loses progress.
 */

const PREFIX = "PGS1";
const SALT_BYTES = 4;
const CHECKSUM_BYTES = 8;
const SECRET = new TextEncoder().encode("poo-game/storage/v1:🧻🪠💨");

/** cyrb53-style 64-bit keyed checksum (two 32-bit lanes); fast and synchronous. */
const checksum = (data: Bytes): Bytes => {
  let h1 = 0xde_ad_be_ef;
  let h2 = 0x41_c6_ce_57;
  for (const byte of [...SECRET, ...data]) {
    h1 = Math.imul(h1 ^ byte, 2_654_435_761);
    h2 = Math.imul(h2 ^ byte, 1_597_334_677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2_246_822_507) ^ Math.imul(h2 ^ (h2 >>> 13), 3_266_489_909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2_246_822_507) ^ Math.imul(h1 ^ (h1 >>> 13), 3_266_489_909);
  const out = new Uint8Array(CHECKSUM_BYTES);
  const view = new DataView(out.buffer);
  view.setUint32(0, h1 >>> 0);
  view.setUint32(4, h2 >>> 0);
  return out;
};

/** Seals any JSON-serializable value into an opaque string. */
export const sealValue = (value: unknown): string => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const json = new TextEncoder().encode(JSON.stringify(value));
  const scrambled = scramble(json, SECRET, salt);
  const tag = checksum(new Uint8Array([...salt, ...scrambled]));
  return PREFIX + toBase64Url(new Uint8Array([...salt, ...tag, ...scrambled]));
};

export const isSealed = (text: string): boolean => text.startsWith(PREFIX);

/** The sealed value, or undefined if `text` isn't sealed or was modified. */
export const openValue = (text: string): unknown => {
  if (!isSealed(text)) return undefined;
  try {
    const bytes = fromBase64Url(text.slice(PREFIX.length));
    if (bytes.length <= SALT_BYTES + CHECKSUM_BYTES) return undefined;
    const salt = bytes.slice(0, SALT_BYTES);
    const tag = bytes.slice(SALT_BYTES, SALT_BYTES + CHECKSUM_BYTES);
    const scrambled = bytes.slice(SALT_BYTES + CHECKSUM_BYTES);
    if (!sameBytes(tag, checksum(new Uint8Array([...salt, ...scrambled])))) return undefined;
    return JSON.parse(new TextDecoder().decode(scramble(scrambled, SECRET, salt)));
  } catch {
    return undefined;
  }
};
