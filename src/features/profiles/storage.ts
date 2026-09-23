import { readJson, writeJson } from "../../shared/lib/storage";
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

/** The stored profiles, or a single new "Player 1" profile on first run. */
export const loadProfiles = (): ProfilesState => {
  const stored = parseProfiles(readJson(PROFILES_KEY));
  if (stored) return stored;
  const profile = createProfile("Player 1");
  return { activeId: profile.id, profiles: [profile] };
};

export const writeProfiles = (state: ProfilesState): void => {
  writeJson(PROFILES_KEY, { version: PROFILES_VERSION, ...state });
};
