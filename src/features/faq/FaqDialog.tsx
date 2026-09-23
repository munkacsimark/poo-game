import type { ReactNode } from "react";
import { Modal } from "../../shared/ui/Modal";
import { MAX_PROFILES } from "../profiles/profiles";
import { RARITIES, RARITY_CLASS } from "../game/rarity";
import { dropRates, pityRules } from "./dropRates";

const Question = ({
  title,
  children,
  open,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) => (
  <details open={open} className="group border-b border-white/10 py-3 last:border-0">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white [&::-webkit-details-marker]:hidden">
      {title}
      <span aria-hidden className="text-white/40 transition group-open:rotate-45">
        +
      </span>
    </summary>
    <div className="mt-2 flex flex-col gap-2 text-sm text-white/80">{children}</div>
  </details>
);

/** Frequently asked questions, opened from the footer's FAQ link. */
export const FaqDialog = ({ onClose }: { onClose: () => void }) => (
  <Modal title="FAQ" onClose={onClose}>
    <Question title="How do I play?" open>
      <p>
        Tap the emoji over and over. Every so often it poops out a new one: collect all 298, from
        Common up to the one-in-2,000 Galaxy Opal. Tap any emoji in your collection to show it off.
      </p>
    </Question>

    <Question title="What are the drop rates?">
      <table className="w-full text-xs tabular-nums">
        <thead className="text-white/50">
          <tr>
            <th scope="col" className="pb-1 text-left font-medium">
              Rarity
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Chance
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Odds
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Emojis
            </th>
          </tr>
        </thead>
        <tbody>
          {dropRates().map(({ id, label, chance, oneIn, emojis }) => (
            <tr key={id} className={`${RARITY_CLASS[id]} border-t border-white/10`}>
              <th scope="row" className="py-1 text-left font-medium text-(--rarity)">
                {label}
              </th>
              <td className="py-1 text-right">{chance}</td>
              <td className="py-1 text-right text-white/60">{oneIn}</td>
              <td className="py-1 text-right text-white/60">{emojis}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Every drop rolls independently with secure randomness, plus two luck protections:</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {pityRules().map((rule) => (
          <li key={rule}>{rule}.</li>
        ))}
        <li>A drop never repeats the emoji you're showing.</li>
      </ul>
    </Question>

    <Question title="How is an emoji's rarity decided?">
      <p>By its theme:</p>
      <ul className="flex flex-col gap-1">
        {RARITIES.map(({ id, label, theme }) => (
          <li key={id} className={RARITY_CLASS[id]}>
            <span className="font-semibold text-(--rarity)">{label}:</span> {theme}
          </li>
        ))}
      </ul>
    </Question>

    <Question title="Can more people play on one device?">
      <p>
        Yes. Tap your avatar in the top corner, then add a profile. Up to {MAX_PROFILES} profiles
        fit on a device, each with its own collection. With more than one, the game asks who's
        playing when it starts.
      </p>
    </Question>

    <Question title="How do I move my progress to another device?">
      <p>
        Tap your avatar, choose <strong>Manage profiles</strong>, pick your profile and tap{" "}
        <strong>Export</strong>. That saves a <code>.poo</code> file. On the other device, tap{" "}
        <strong>Import profile</strong> and choose the file.
      </p>
      <p>Exporting now and then is also a good backup.</p>
    </Question>

    <Question title="Can I edit a profile file?">
      <p>
        No. Profile files are scrambled and signed, so any change makes the import fail. Your emojis
        have to be earned the honest way.
      </p>
    </Question>

    <Question title="Does it work offline?">
      <p>
        Yes. After the first visit the whole game works without a connection, and you can install it
        from your browser's menu (“Add to Home Screen” / “Install”) to play it like an app.
      </p>
    </Question>

    <Question title="Is my data sent anywhere?">
      <p>
        No. Progress lives only in this browser. Clearing the site's data deletes it, so export your
        profile first if you want to keep it.
      </p>
    </Question>
  </Modal>
);
