import { isRecord, parseSaveData } from "../game/save";
import { AVATARS, cleanName, isAvatar, type Avatar, type Profile } from "./profiles";

/**
 * Exported profile files ("<name>.poo"). They're obfuscated and signed so players can't casually
 * read or edit them: the JSON is deflated, XOR-scrambled with a salted key stream and tagged
 * with an HMAC, then base64url-encoded behind a format prefix.
 *
 * This is tamper *resistance*, not security: the key ships with the app, so a determined player
 * can still forge a file. It's enough to make hand-editing useless.
 *
 * Layout: "POO1" + base64url(salt[4] ‖ tag[16] ‖ scrambled payload)
 * To change the format, add "POO2" and keep decoding "POO1" so old files still import.
 */

const PREFIX = "POO1";
const SALT_BYTES = 4;
const TAG_BYTES = 16;
/** Imports larger than this can't be genuine profiles. */
const MAX_FILE_LENGTH = 64 * 1024;

type Bytes = Uint8Array<ArrayBuffer>;

const SECRET = new TextEncoder().encode("poo-game/profile-file/v1:💩🌈🦄✨");

export type ProfileFileErrorReason = "format" | "tampered" | "invalid";

export class ProfileFileError extends Error {
  constructor(readonly reason: ProfileFileErrorReason) {
    super(
      {
        format: "This isn't a Poo Game profile file.",
        tampered: "This profile file was modified or is damaged.",
        invalid: "This profile file has no valid progress in it.",
      }[reason],
    );
    this.name = "ProfileFileError";
  }
}

/** What a file carries; importing always creates a new profile with a fresh id. */
export type ExportedProfile = Pick<Profile, "name" | "avatar" | "save">;

// Base64url without padding, via the widely supported btoa/atob.
const toBase64Url = (bytes: Bytes): string =>
  btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");

const fromBase64Url = (text: string): Bytes => {
  const binary = atob(text.replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
};

const transform = async (bytes: Bytes, stream: CompressionStream | DecompressionStream) => {
  const body = new Response(bytes).body;
  if (!body) throw new Error("Empty stream");
  return new Uint8Array(await new Response(body.pipeThrough(stream)).arrayBuffer());
};

/** XORs `bytes` with an xorshift32 key stream seeded from the secret and the salt. */
const scramble = (bytes: Bytes, salt: Bytes): Bytes => {
  let state = 0x9e_37_79_b9;
  for (const byte of [...SECRET, ...salt]) state = Math.imul(state ^ byte, 0x01_00_01_93);
  return bytes.map((byte) => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return byte ^ (state & 0xff);
  });
};

const sign = async (data: Bytes): Promise<Bytes> => {
  const key = await crypto.subtle.importKey(
    "raw",
    SECRET,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data)).slice(0, TAG_BYTES);
};

const sameBytes = (a: Bytes, b: Bytes) =>
  a.length === b.length && a.every((byte, index) => byte === b[index]);

export const encodeProfile = async ({ name, avatar, save }: ExportedProfile): Promise<string> => {
  const json = new TextEncoder().encode(JSON.stringify({ name, avatar, save }));
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const scrambled = scramble(await transform(json, new CompressionStream("deflate-raw")), salt);
  const tag = await sign(new Uint8Array([...salt, ...scrambled]));
  return PREFIX + toBase64Url(new Uint8Array([...salt, ...tag, ...scrambled]));
};

const parseExported = (value: unknown): ExportedProfile => {
  if (!isRecord(value) || typeof value.name !== "string") throw new ProfileFileError("invalid");
  const save = parseSaveData(value.save);
  if (!save) throw new ProfileFileError("invalid");
  const avatar: Avatar = isAvatar(value.avatar) ? value.avatar : AVATARS[0];
  return { name: cleanName(value.name), avatar, save };
};

/** Decodes and validates a profile file; throws a `ProfileFileError` explaining why not. */
export const decodeProfile = async (text: string): Promise<ExportedProfile> => {
  const trimmed = text.trim();
  if (!trimmed.startsWith(PREFIX) || trimmed.length > MAX_FILE_LENGTH) {
    throw new ProfileFileError("format");
  }

  let bytes: Bytes;
  try {
    bytes = fromBase64Url(trimmed.slice(PREFIX.length));
  } catch {
    throw new ProfileFileError("tampered");
  }
  if (bytes.length <= SALT_BYTES + TAG_BYTES) throw new ProfileFileError("tampered");

  const salt = bytes.slice(0, SALT_BYTES);
  const tag = bytes.slice(SALT_BYTES, SALT_BYTES + TAG_BYTES);
  const scrambled = bytes.slice(SALT_BYTES + TAG_BYTES);
  if (!sameBytes(tag, await sign(new Uint8Array([...salt, ...scrambled])))) {
    throw new ProfileFileError("tampered");
  }

  let value: unknown;
  try {
    const json = await transform(scramble(scrambled, salt), new DecompressionStream("deflate-raw"));
    value = JSON.parse(new TextDecoder().decode(json));
  } catch {
    throw new ProfileFileError("invalid");
  }
  return parseExported(value);
};

/** A safe download name, e.g. "Grandpa Joe" → "poo-game-grandpa-joe.poo". */
export const profileFileName = (name: string): string => {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
  return `poo-game-${slug || "profile"}.poo`;
};
