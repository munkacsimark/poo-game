import { describe, expect, it } from "vitest";
import { decodeProfile, encodeProfile, profileFileName, type ExportedProfile } from "./profileFile";

const profile: ExportedProfile = {
  name: "Mark",
  avatar: "🦊",
  save: {
    selected: "🦄",
    clicks: 420,
    collection: { "🦄": 1, "🍟": 3 },
    pity: { legendary: 12, epic: 4 },
  },
};

const flipCharAt = (text: string, index: number) =>
  text.slice(0, index) + (text[index] === "A" ? "B" : "A") + text.slice(index + 1);

describe("profile files", () => {
  it("round-trips a profile", async () => {
    expect(await decodeProfile(await encodeProfile(profile))).toEqual(profile);
  });

  it("is unreadable and differs on every export", async () => {
    const first = await encodeProfile(profile);
    const second = await encodeProfile(profile);
    expect(first).toMatch(/^POO1[\w-]+$/);
    expect(first).not.toContain("Mark");
    expect(first).not.toBe(second);
  });

  it("rejects edited files", async () => {
    const file = await encodeProfile(profile);
    await Promise.all(
      [4, 12, 30, file.length - 2].map((index) =>
        expect(decodeProfile(flipCharAt(file, index))).rejects.toMatchObject({
          reason: "tampered",
        }),
      ),
    );
    await expect(decodeProfile(file.slice(0, 20))).rejects.toMatchObject({ reason: "tampered" });
  });

  it("rejects files that aren't profiles", async () => {
    await expect(decodeProfile('{"name":"Mark"}')).rejects.toMatchObject({ reason: "format" });
    await expect(decodeProfile("POO1!!!")).rejects.toMatchObject({ reason: "tampered" });
    await expect(decodeProfile(`POO1${"A".repeat(70_000)}`)).rejects.toMatchObject({
      reason: "format",
    });
  });

  it("still imports files exported by v0.1.1 (POO1)", async () => {
    // Exported with the POO1 format as released. Never regenerate this: it guards
    // compatibility with files players already have.
    const file =
      "POO1ZcvxPLcAzYABLMUA1ZA8Zw0VzOl9-8PH2GLuQQIac1cq7T9_f3MY094ypcuSmNSqjXgUAMrzSa8mXQQvYLSW3dce5a8R_v03IlJdp1Aw3LbV6cX8Wx_tJAdHpVLjQiuS-pSifiv8QDGSFrNj6TEYbUtj4JAFWvV-5ezKHkPfkc0XQH2Ipudc";
    expect(await decodeProfile(file)).toEqual(profile);
  });

  it("tolerates surrounding whitespace", async () => {
    expect(await decodeProfile(`\n ${await encodeProfile(profile)}\n`)).toEqual(profile);
  });
});

describe("profileFileName", () => {
  it("builds a safe file name", () => {
    expect(profileFileName("Grandpa Joe")).toBe("poo-game-grandpa-joe.poo");
    expect(profileFileName("Zoë!")).toBe("poo-game-zoe.poo");
    expect(profileFileName("💩")).toBe("poo-game-profile.poo");
  });
});
