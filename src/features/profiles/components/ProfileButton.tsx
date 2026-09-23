import { Link } from "@tanstack/react-router";
import type { Profile } from "../profiles";

/** Header link showing the active profile's avatar; opens the profile picker. */
export const ProfileButton = ({ profile }: { profile: Profile }) => (
  <Link
    to="/profiles"
    aria-label={`Switch profile (${profile.name})`}
    title={profile.name}
    className="grid size-10 place-items-center rounded-full glass font-emoji text-xl transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
  >
    <span aria-hidden>{profile.avatar}</span>
  </Link>
);
