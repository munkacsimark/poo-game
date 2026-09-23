/** Slowly drifting blurred color blobs behind the glass UI. */
export const Aurora = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-1/4 -left-1/4 size-[70vmax] animate-aurora rounded-full bg-[radial-gradient(circle,oklch(0.5_0.25_300/0.55),transparent_60%)] blur-3xl" />
    <div className="absolute -right-1/4 -bottom-1/3 size-[65vmax] animate-aurora rounded-full bg-[radial-gradient(circle,oklch(0.55_0.2_200/0.4),transparent_60%)] blur-3xl [animation-delay:-6s]" />
    <div className="absolute top-1/3 left-1/3 size-[45vmax] animate-aurora rounded-full bg-[radial-gradient(circle,oklch(0.6_0.24_350/0.3),transparent_60%)] blur-3xl [animation-delay:-12s]" />
  </div>
);
