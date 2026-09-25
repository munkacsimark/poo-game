import { useEffect, useId, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "../lib/motion";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Pinned below the scrolling body, e.g. form actions. */
  footer?: ReactNode;
};

/** Longest exit transition in `modal-motion` (index.css), plus a little slack. */
const EXIT_MS = 250;

/**
 * Native modal `<dialog>` in the glass style: opens on mount (animated in), closes with Escape,
 * the Close button or a click on the backdrop (animated out), then calls `onClose` so the parent
 * can unmount it.
 */
export const Modal = ({ title, onClose, children, footer }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Syncs with the native dialog API: open as a modal once mounted.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // Plays the exit transition (data-closing), then really closes, which fires onClose.
  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing !== undefined) return;
    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "";
    window.setTimeout(() => dialog.close(), EXIT_MS);
  };

  return (
    // Keyboard users close the dialog with Escape or the Close button; the click handler only
    // adds backdrop dismissal for pointers.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Escape: animate out instead of vanishing.
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      // Clicking the backdrop (the dialog element itself, outside its content) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      aria-labelledby={titleId}
      className="m-auto max-h-[min(40rem,calc(100dvh-2rem))] w-[min(32rem,calc(100vw-2rem))] modal-motion overflow-hidden rounded-3xl glass bg-canvas/90 p-0 text-fg/90 backdrop:bg-canvas/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[inherit] flex-col">
        <header
          data-slot="title-bar"
          className="flex items-center justify-between gap-4 border-b border-fg/10 px-5 py-4"
        >
          <h2 id={titleId} className="text-lg font-bold text-fg">
            {title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="grid size-9 cursor-pointer place-items-center rounded-pill glass text-lg transition duration-300 ease-spring outline-none hover:rotate-90 hover:bg-fg/15 focus-visible:ring-2 focus-visible:ring-accent active:scale-90"
          >
            <span aria-hidden>×</span>
          </button>
        </header>
        {/* pt-2: room for the first row's focus ring inside the scroll container. */}
        <div className="overflow-y-auto px-5 pt-2 pb-5">{children}</div>
        {footer && <div className="border-t border-fg/10 px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
};
