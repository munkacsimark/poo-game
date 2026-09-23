import type { ReactNode } from "react";

type Props = {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

/**
 * A native `<details>` disclosure that animates its height (see the `accordion` utility) and
 * turns its chevron. Without `::details-content` support it simply opens and closes.
 */
export const AccordionItem = ({ summary, children, defaultOpen }: Props) => (
  <details open={defaultOpen} className="group accordion border-b border-white/10 last:border-0">
    <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white [&::-webkit-details-marker]:hidden">
      {summary}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-5 shrink-0 text-white/40 transition-transform duration-500 ease-spring group-open:rotate-180 group-hover:text-white/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div className="pb-4">{children}</div>
  </details>
);
