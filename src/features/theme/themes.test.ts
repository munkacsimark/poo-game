import { describe, expect, it } from "vitest";
import { CANVAS_COLOR, DEFAULT_APPEARANCE, parseAppearance, resolveMode, THEMES } from "./themes";

describe("parseAppearance", () => {
  it("keeps a valid appearance", () => {
    expect(parseAppearance({ theme: "hacker", mode: "light" })).toEqual({
      theme: "hacker",
      mode: "light",
    });
  });

  it("falls back to the defaults field by field", () => {
    expect(parseAppearance(undefined)).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance("retro")).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance({ theme: "neon", mode: "dark" })).toEqual({
      theme: "aurora",
      mode: "dark",
    });
    expect(parseAppearance({ theme: "luxury", mode: "dim" })).toEqual({
      theme: "luxury",
      mode: "system",
    });
  });
});

describe("resolveMode", () => {
  it("follows the system only in system mode", () => {
    expect(resolveMode("system", true)).toBe("dark");
    expect(resolveMode("system", false)).toBe("light");
    expect(resolveMode("light", true)).toBe("light");
    expect(resolveMode("dark", false)).toBe("dark");
  });
});

it("has a canvas color for every theme", () => {
  expect(Object.keys(CANVAS_COLOR).toSorted()).toEqual(THEMES.map(({ id }) => id).toSorted());
});
