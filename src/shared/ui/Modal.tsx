import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Pinned below the scrolling body, e.g. form actions. */
  footer?: ReactNode;
};

/**
 * Native modal `<dialog>` in the glass style: opens on mount, closes with Escape, the Close
 * button or a click on the backdrop, and calls `onClose` so the parent can unmount it.
 */
export const Modal = ({ title, onClose, children, footer }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Syncs with the native dialog API: open as a modal once mounted.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    // Keyboard users close the dialog with Escape or the Close button; the click handler only
    // adds backdrop dismissal for pointers.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside its content) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      aria-labelledby={titleId}
      className="m-auto max-h-[min(40rem,calc(100dvh-2rem))] w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-3xl glass bg-ink/90 p-0 text-white/90 backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="grid size-9 cursor-pointer place-items-center rounded-full glass text-lg transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden>×</span>
          </button>
        </header>
        <div className="overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-white/10 px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
};
