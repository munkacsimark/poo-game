/**
 * The theme's backdrop: slowly drifting blurred color blobs behind the UI (colors and strength
 * come from the theme, see features/theme/themes.css), plus an optional fixed overlay such as
 * the Terminal theme's scanlines.
 */
export const Aurora = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-(--aurora-opacity) transition-opacity duration-700"
    >
      <div className="absolute -top-1/4 -left-1/4 size-[70vmax] animate-aurora rounded-full bg-[radial-gradient(circle,var(--aurora-1),transparent_60%)] blur-3xl" />
      <div className="absolute -right-1/4 -bottom-1/3 size-[65vmax] animate-aurora rounded-full bg-[radial-gradient(circle,var(--aurora-2),transparent_60%)] blur-3xl [animation-delay:-6s]" />
      <div className="absolute top-1/3 left-1/3 size-[45vmax] animate-aurora rounded-full bg-[radial-gradient(circle,var(--aurora-3),transparent_60%)] blur-3xl [animation-delay:-12s]" />
    </div>
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 bg-(image:--overlay-image)"
    />
  </>
);
