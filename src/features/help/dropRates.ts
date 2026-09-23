import { EMOJIS_BY_RARITY } from "../game/emojis";
import { PITY_RULES } from "../game/pity";
import { RARITIES, TOTAL_WEIGHT, type Rarity } from "../game/rarity";

const percent = new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 2 });
const odds = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });

export type DropRate = {
  id: Rarity;
  label: string;
  /** e.g. "0.05%" */
  chance: string;
  /** e.g. "1 in 2,000" */
  oneIn: string;
  emojis: number;
};

/** Published per-drop rates, derived from the same `RARITIES` table the rolls use. */
export const dropRates = (): DropRate[] =>
  RARITIES.map(({ id, label, weight }) => {
    const oneIn = TOTAL_WEIGHT / weight;
    return {
      id,
      label,
      chance: percent.format(weight / TOTAL_WEIGHT),
      oneIn: `1 in ${(oneIn < 10 ? odds : whole).format(oneIn)}`,
      emojis: EMOJIS_BY_RARITY[id].length,
    };
  });

/** e.g. "Epic or better is guaranteed at least once every 30 drops". */
export const pityRules = (): string[] =>
  PITY_RULES.toReversed().map(({ rarity, within }) => {
    const label = RARITIES.find(({ id }) => id === rarity)?.label ?? rarity;
    return `${label} or better is guaranteed at least once every ${within} drops`;
  });
