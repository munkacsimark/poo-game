import { describe, expect, it } from "vitest";
import { emojiFromId, emojiId, EMOJI_IDS } from "./emojiIds";
import { EMOJIS_BY_RARITY } from "./emojis";
import { RARITIES } from "./rarity";

describe("emoji ids", () => {
  it("gives every emoji a unique, slug-shaped id", () => {
    const emojis = RARITIES.flatMap(({ id }) => EMOJIS_BY_RARITY[id]);
    const ids = emojis.map(emojiId);
    expect(new Set(ids).size).toBe(emojis.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("maps ids back to emojis", () => {
    expect(emojiId("💩")).toBe("pile-of-poo");
    expect(emojiFromId("unicorn")).toBe("🦄");
    expect(emojiFromId("not-an-emoji")).toBeUndefined();
  });

  it("never changes an id (saves reference them)", () => {
    // A sample pinned on purpose: if this fails, an id was renamed. Add an alias instead.
    expect([EMOJI_IDS["🦄"], EMOJI_IDS["🐉"], EMOJI_IDS["🍟"], EMOJI_IDS["⛄️"]]).toEqual([
      "unicorn",
      "dragon",
      "french-fries",
      "snowman-without-snow",
    ]);
  });
});
