import { isSealed, openValue, sealValue } from "../../shared/lib/sealedStorage";
import { readText, writeText } from "../../shared/lib/storage";
import { createStarterSave, isRecord, parseSaveData } from "../game/save";
import {
  AVATARS,
  cleanName,
  isAvatar,
  MAX_PROFILES,
  type Avatar,
  type Profile,
  type ProfilesState,
} from "./profiles";

const PROFILES_KEY = "poo-game:profiles";
/**
 * Set once profiles have been written sealed. v0.1.1 stored plain JSON; that is read (and
 * resealed) only while this marker is absent, so pasting plain JSON back in doesn't work.
 */
const SEALED_MARKER_KEY = "poo-game:sealed";
/**
 * Bump when the stored shape (this container, `Profile` or `SaveData`) changes, and migrate
 * every older version in `parseProfiles` so players never lose progress.
 */
const PROFILES_VERSION = 1;

const randomAvatar = (): Avatar =>
  AVATARS[Math.floor(Math.random() * AVATARS.length)] ?? AVATARS[0];

export const createProfile = (name: string, avatar: Avatar = randomAvatar()): Profile => ({
  id: crypto.randomUUID(),
  name: cleanName(name),
  avatar,
  save: createStarterSave(),
});

/** Validates one stored or imported profile. */
export const parseProfile = (value: unknown): Profile | undefined => {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") {
    return undefined;
  }
  const save = parseSaveData(value.save);
  if (!save) return undefined;
  return {
    id: value.id,
    name: cleanName(value.name),
    avatar: isAvatar(value.avatar) ? value.avatar : AVATARS[0],
    save,
  };
};

const parseProfiles = (value: unknown): ProfilesState | undefined => {
  if (!isRecord(value) || value.version !== PROFILES_VERSION) return undefined;
  if (!Array.isArray(value.profiles)) return undefined;

  const profiles: Profile[] = [];
  for (const item of value.profiles) {
    const profile = parseProfile(item);
    const duplicate = profiles.some(({ id }) => id === profile?.id);
    if (profile && !duplicate && profiles.length < MAX_PROFILES) profiles.push(profile);
  }
  const [first] = profiles;
  if (!first) return undefined;

  const active = profiles.find(({ id }) => id === value.activeId);
  return { activeId: (active ?? first).id, profiles };
};

/** Stored profiles are sealed (see sealedStorage); v0.1.1's plain JSON migrates once. */
const readStored = (): unknown => {
  const text = readText(PROFILES_KEY);
  if (text === undefined) return undefined;
  if (isSealed(text)) return openValue(text);
  if (readText(SEALED_MARKER_KEY) !== undefined) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

/**
 * The stored profiles, or a single new "Player 1" profile on first run. Edited or damaged
 * storage fails its checksum and also starts fresh.
 */
export const loadProfiles = (): ProfilesState => {
  const stored = parseProfiles(readStored());
  if (stored) return stored;
  const profile = createProfile("Player 1");
  return { activeId: profile.id, profiles: [profile] };
};

export const writeProfiles = (state: ProfilesState): void => {
  writeText(PROFILES_KEY, sealValue({ version: PROFILES_VERSION, ...state }));
  writeText(SEALED_MARKER_KEY, "1");
};
