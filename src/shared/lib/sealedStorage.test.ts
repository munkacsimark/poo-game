import { describe, expect, it } from "vitest";
import { isSealed, openValue, sealValue } from "./sealedStorage";

const value = { version: 1, name: "Mark", clicks: 420, collection: { "🦄": 2 } };

const flipCharAt = (text: string, index: number) =>
  text.slice(0, index) + (text[index] === "A" ? "B" : "A") + text.slice(index + 1);

describe("sealedStorage", () => {
  it("round-trips any JSON value", () => {
    expect(openValue(sealValue(value))).toEqual(value);
    expect(openValue(sealValue([1, "two", null]))).toEqual([1, "two", null]);
  });

  it("is unreadable and differs every time", () => {
    const sealed = sealValue(value);
    expect(isSealed(sealed)).toBe(true);
    expect(sealed).toMatch(/^PGS1[\w-]+$/);
    expect(sealed).not.toContain("Mark");
    expect(sealValue(value)).not.toBe(sealed);
  });

  it("rejects any edit", () => {
    const sealed = sealValue(value);
    for (const index of [4, 10, 20, sealed.length - 1]) {
      expect(openValue(flipCharAt(sealed, index))).toBeUndefined();
    }
    expect(openValue(sealed.slice(0, 12))).toBeUndefined();
  });

  it("ignores anything that isn't sealed", () => {
    expect(openValue(JSON.stringify(value))).toBeUndefined();
    expect(openValue("PGS1!!!")).toBeUndefined();
  });
});
