import { Link } from "@tanstack/react-router";
import type { Profile } from "../profiles";

/** Header link showing the active profile's avatar; opens the profile picker. */
export const ProfileButton = ({ profile }: { profile: Profile }) => (
  <Link
    to="/profiles"
    aria-label={`Switch profile (${profile.name})`}
    title={profile.name}
    className="group grid size-10 place-items-center rounded-full glass font-emoji text-xl transition duration-300 ease-spring outline-none hover:-translate-y-0.5 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white active:scale-90"
  >
    <span
      aria-hidden
      className="transition duration-300 ease-spring group-hover:scale-110 group-hover:-rotate-12"
    >
      {profile.avatar}
    </span>
  </Link>
);
