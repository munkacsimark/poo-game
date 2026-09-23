import type { Emoji } from "../features/game/emojis";
import type { Collection, SaveData } from "../features/game/save";
import type { Profile } from "../features/profiles/profiles";
import { loadProfiles, writeProfiles } from "../features/profiles/storage";

export const T0 = "2026-01-01T00:00:00.000Z";

/** { "🍟": 3 } → a collection with those counts, all first found at T0. */
export const owned = (counts: Partial<Record<Emoji, number>>): Collection =>
  Object.fromEntries(
    Object.entries(counts).map(([emoji, count]) => [emoji, { count, firstFoundAt: T0 }]),
  );

type Seed = {
  name: string;
  save?: Partial<Omit<SaveData, "collection">> & { collection?: Partial<Record<Emoji, number>> };
};

/** Stores the given profiles (the first one active), as if the player had created them. */
export const seedProfiles = (...seeds: Seed[]): Profile[] => {
  const profiles = seeds.map(({ name, save }, index): Profile => ({
    id: `profile-${index}`,
    name,
    avatar: "🐱",
    createdAt: T0,
    save: {
      selected: save?.selected ?? "🍟",
      clicks: save?.clicks ?? 0,
      collection: owned(save?.collection ?? { [save?.selected ?? "🍟"]: 1 }),
      pity: save?.pity ?? { legendary: 0, epic: 0 },
    },
  }));
  writeProfiles({ activeId: profiles[0]?.id ?? "", profiles });
  return profiles;
};

/** The active profile's stored progress. */
export const storedSave = (): SaveData => {
  const loaded = loadProfiles();
  if (loaded.status !== "ok") throw new Error(`Stored data unusable: ${loaded.reason}`);
  const active = loaded.state.profiles.find(({ id }) => id === loaded.state.activeId);
  if (!active) throw new Error("No active profile stored");
  return active.save;
};
