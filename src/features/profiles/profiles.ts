import { createStarterSave, type SaveData } from "../game/save";

export const MAX_PROFILES = 5;
export const MAX_NAME_LENGTH = 20;

/** Profile pictures to choose from. */
export const AVATARS = [
  "🐱",
  "🐶",
  "🦊",
  "🐸",
  "🐵",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐧",
  "🐙",
  "🤖",
] as const;
export type Avatar = (typeof AVATARS)[number];

/** Stable ids for storage; like emoji ids, never change one. */
export const AVATAR_IDS = {
  "🐱": "cat",
  "🐶": "dog",
  "🦊": "fox",
  "🐸": "frog",
  "🐵": "monkey",
  "🐼": "panda",
  "🐨": "koala",
  "🐯": "tiger",
  "🦁": "lion",
  "🐧": "penguin",
  "🐙": "octopus",
  "🤖": "robot",
} as const satisfies Record<Avatar, string>;

/** The avatar for a stored id; unknown ids (e.g. from a newer version) fall back to the first. */
export const avatarFromId = (id: string): Avatar =>
  AVATARS.find((avatar) => AVATAR_IDS[avatar] === id) ?? AVATARS[0];

export type Profile = {
  id: string;
  name: string;
  avatar: Avatar;
  /** ISO timestamp. */
  createdAt: string;
  save: SaveData;
};

export type ProfilesState = {
  activeId: string;
  /** Never empty. */
  profiles: Profile[];
};

export type ProfilesAction =
  | { type: "add"; profile: Profile }
  | { type: "edit"; id: string; name: string; avatar: Avatar }
  | { type: "remove"; id: string }
  | { type: "switch"; id: string }
  | { type: "save"; id: string; save: SaveData };

const randomAvatar = (): Avatar =>
  AVATARS[Math.floor(Math.random() * AVATARS.length)] ?? AVATARS[0];

/** A brand-new profile with a starter emoji. */
export const createProfile = (name: string, avatar: Avatar = randomAvatar()): Profile => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: cleanName(name),
    avatar,
    createdAt: now,
    save: createStarterSave(now),
  };
};

/** Trims and shortens a name; empty names become "Player". */
export const cleanName = (name: string): string =>
  name.trim().replaceAll(/\s+/g, " ").slice(0, MAX_NAME_LENGTH).trim() || "Player";

/** Appends " 2", " 3", … until the name isn't taken, e.g. for an imported profile. */
export const uniqueName = (name: string, profiles: readonly Profile[]): string => {
  const taken = new Set(profiles.map((profile) => profile.name.toLowerCase()));
  if (!taken.has(name.toLowerCase())) return name;
  for (let n = 2; ; n++) {
    const candidate = `${name.slice(0, MAX_NAME_LENGTH - String(n).length - 1)} ${n}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
};

const update = (state: ProfilesState, id: string, change: (profile: Profile) => Profile) => ({
  ...state,
  profiles: state.profiles.map((profile) => (profile.id === id ? change(profile) : profile)),
});

export const profilesReducer = (state: ProfilesState, action: ProfilesAction): ProfilesState => {
  switch (action.type) {
    case "add":
      if (state.profiles.length >= MAX_PROFILES) return state;
      return {
        ...state,
        profiles: [
          ...state.profiles,
          { ...action.profile, name: uniqueName(cleanName(action.profile.name), state.profiles) },
        ],
      };
    case "edit": {
      const others = state.profiles.filter((profile) => profile.id !== action.id);
      const name = uniqueName(cleanName(action.name), others);
      return update(state, action.id, (profile) => ({ ...profile, name, avatar: action.avatar }));
    }
    case "remove": {
      const profiles = state.profiles.filter((profile) => profile.id !== action.id);
      const [first] = profiles;
      if (!first) return state;
      return {
        profiles,
        activeId: state.activeId === action.id ? first.id : state.activeId,
      };
    }
    case "switch":
      return state.profiles.some((profile) => profile.id === action.id)
        ? { ...state, activeId: action.id }
        : state;
    case "save":
      return update(state, action.id, (profile) => ({ ...profile, save: action.save }));
  }
};
