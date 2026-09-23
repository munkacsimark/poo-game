import { describe, expect, it } from "vitest";
import { advancePity, INITIAL_PITY, pityFloor } from "./pity";

describe("pity", () => {
  it("has no floor until a rule triggers", () => {
    expect(pityFloor(INITIAL_PITY)).toBeUndefined();
    expect(pityFloor({ legendary: 28, epic: 28 })).toBeUndefined();
  });

  it("guarantees Epic or better on the 30th drop without one", () => {
    expect(pityFloor({ legendary: 29, epic: 29 })).toBe("epic");
  });

  it("guarantees Legendary or better on the 150th drop without one, before Epic", () => {
    expect(pityFloor({ legendary: 149, epic: 29 })).toBe("legendary");
  });

  it("counts drops and resets on the protected rarity or better", () => {
    expect(advancePity({ legendary: 3, epic: 3 }, "rare")).toEqual({ legendary: 4, epic: 4 });
    expect(advancePity({ legendary: 3, epic: 3 }, "epic")).toEqual({ legendary: 4, epic: 0 });
    expect(advancePity({ legendary: 3, epic: 3 }, "mythic")).toEqual({ legendary: 0, epic: 0 });
  });
});
