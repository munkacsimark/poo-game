import type { Profile } from "../profiles";

/** Header button showing the active profile's avatar; opens the profile picker. */
export const ProfileButton = ({ profile, onClick }: { profile: Profile; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Switch profile (${profile.name})`}
    title={profile.name}
    className="grid size-10 cursor-pointer place-items-center rounded-full glass font-emoji text-xl transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
  >
    <span aria-hidden>{profile.avatar}</span>
  </button>
);
