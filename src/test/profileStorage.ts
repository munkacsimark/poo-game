import type { SaveData } from "../features/game/save";
import type { Profile } from "../features/profiles/profiles";
import { loadProfiles, writeProfiles } from "../features/profiles/storage";

const emptySave: SaveData = {
  selected: "🍟",
  clicks: 0,
  collection: { "🍟": 1 },
  pity: { legendary: 0, epic: 0 },
};

type Seed = { name: string; save?: Partial<SaveData> };

/** Stores the given profiles (the first one active), as if the player had created them. */
export const seedProfiles = (...seeds: Seed[]): Profile[] => {
  const profiles = seeds.map(({ name, save }, index): Profile => ({
    id: `profile-${index}`,
    name,
    avatar: "🐱",
    save: { ...emptySave, ...save },
  }));
  writeProfiles({ activeId: profiles[0]?.id ?? "", profiles });
  return profiles;
};

/** The active profile's stored progress. */
export const storedSave = (): SaveData => {
  const { activeId, profiles } = loadProfiles();
  const active = profiles.find(({ id }) => id === activeId);
  if (!active) throw new Error("No active profile stored");
  return active.save;
};
