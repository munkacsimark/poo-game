import {
  fromBase64Url,
  sameBytes,
  scramble,
  toBase64Url,
  type Bytes,
} from "../../shared/lib/obfuscation";
import type { Profile } from "./profiles";
import { fromStoredProfile, readDocument, toStoredProfile } from "./saveFile";
import {
  PROFILE_FILE_FORMAT,
  ProfileFileSchema,
  SAVE_VERSION,
  type StoredProfileFile,
} from "./schema";

/**
 * Exported profile files ("<name>.poo"). They're obfuscated and signed so players can't casually
 * read or edit them: the JSON is deflated, XOR-scrambled with a salted key stream and tagged
 * with an HMAC, then base64url-encoded behind a format prefix.
 *
 * This is tamper *resistance*, not security: the key ships with the app, so a determined player
 * can still forge a file. It's enough to make hand-editing useless.
 *
 * Layout: "POO1" + base64url(salt[4] ‖ tag[16] ‖ scrambled payload). "POO1" versions this
 * container; the JSON inside is a versioned `ProfileFileSchema` document (schema.ts) that goes
 * through the same migrations as saves. Files from v0.1.1 carry unversioned JSON and are
 * rejected as outdated.
 */

const PREFIX = "POO1";
const SALT_BYTES = 4;
const TAG_BYTES = 16;
/** Imports larger than this can't be genuine profiles. */
const MAX_FILE_LENGTH = 64 * 1024;

const SECRET = new TextEncoder().encode("poo-game/profile-file/v1:💩🌈🦄✨");

export type ProfileFileErrorReason = "format" | "tampered" | "invalid" | "outdated" | "newer";

export class ProfileFileError extends Error {
  constructor(readonly reason: ProfileFileErrorReason) {
    super(
      {
        format: "This isn't a Poo Game profile file.",
        tampered: "This profile file was modified or is damaged.",
        invalid: "This profile file has no valid progress in it.",
        outdated: "This profile file is from an older version of Poo Game and can't be imported.",
        newer:
          "This profile file is from a newer version of Poo Game. Reload to update, then retry.",
      }[reason],
    );
    this.name = "ProfileFileError";
  }
}

/** An imported profile; importing always gives it a fresh id. */
export type ExportedProfile = Omit<Profile, "id">;

const transform = async (bytes: Bytes, stream: CompressionStream | DecompressionStream) => {
  const body = new Response(bytes).body;
  if (!body) throw new Error("Empty stream");
  return new Uint8Array(await new Response(body.pipeThrough(stream)).arrayBuffer());
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

export const encodeProfile = async (profile: Profile): Promise<string> => {
  const document: StoredProfileFile = {
    format: PROFILE_FILE_FORMAT,
    version: SAVE_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: import.meta.env.VITE_APP_VERSION,
    profile: toStoredProfile(profile),
  };
  const json = new TextEncoder().encode(JSON.stringify(document));
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const scrambled = scramble(
    await transform(json, new CompressionStream("deflate-raw")),
    SECRET,
    salt,
  );
  const tag = await sign(new Uint8Array([...salt, ...scrambled]));
  return PREFIX + toBase64Url(new Uint8Array([...salt, ...tag, ...scrambled]));
};

const parseExported = (value: unknown): ExportedProfile => {
  const read = readDocument(value, PROFILE_FILE_FORMAT, ProfileFileSchema);
  if (!read.ok) throw new ProfileFileError(read.error === "damaged" ? "invalid" : read.error);
  const { id: _id, ...profile } = fromStoredProfile(read.document.profile);
  return profile;
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
    const json = await transform(
      scramble(scrambled, SECRET, salt),
      new DecompressionStream("deflate-raw"),
    );
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
