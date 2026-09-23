import { describe, expect, it } from "vitest";
import { flipBase64Char } from "../../test/flipBase64Char";
import { decodeProfile, encodeProfile, profileFileName } from "./profileFile";
import type { Profile } from "./profiles";

const profile: Profile = {
  id: "profile-1",
  name: "Mark",
  avatar: "🦊",
  createdAt: "2026-09-20T12:00:00.000Z",
  save: {
    selected: "🦄",
    clicks: 420,
    collection: {
      "🦄": { count: 1, firstFoundAt: "2026-09-21T09:30:00.000Z" },
      "🍟": { count: 3, firstFoundAt: "2026-09-20T12:00:00.000Z" },
    },
    pity: { legendary: 12, epic: 4 },
  },
};
/** Importing drops the id (the importer assigns a fresh one). */
const { id: _id, ...imported } = profile;

describe("profile files", () => {
  it("round-trips a profile", async () => {
    expect(await decodeProfile(await encodeProfile(profile))).toEqual(imported);
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
        expect(decodeProfile(flipBase64Char(file, index))).rejects.toMatchObject({
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

  it("rejects files exported by v0.1.1 as outdated", async () => {
    // A real v0.1.1 export (unversioned JSON inside the POO1 container).
    const file =
      "POO1ZcvxPLcAzYABLMUA1ZA8Zw0VzOl9-8PH2GLuQQIac1cq7T9_f3MY094ypcuSmNSqjXgUAMrzSa8mXQQvYLSW3dce5a8R_v03IlJdp1Aw3LbV6cX8Wx_tJAdHpVLjQiuS-pSifiv8QDGSFrNj6TEYbUtj4JAFWvV-5ezKHkPfkc0XQH2Ipudc";
    await expect(decodeProfile(file)).rejects.toMatchObject({ reason: "outdated" });
  });

  it("tolerates surrounding whitespace", async () => {
    expect(await decodeProfile(`\n ${await encodeProfile(profile)}\n`)).toEqual(imported);
  });
});

describe("profileFileName", () => {
  it("builds a safe file name", () => {
    expect(profileFileName("Grandpa Joe")).toBe("poo-game-grandpa-joe.poo");
    expect(profileFileName("Zoë!")).toBe("poo-game-zoe.poo");
    expect(profileFileName("💩")).toBe("poo-game-profile.poo");
  });
});
