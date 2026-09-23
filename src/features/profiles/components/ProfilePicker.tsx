import { useState } from "react";
import { TOTAL_EMOJIS } from "../../collection/collection";
import { MAX_PROFILES, type Avatar, type Profile, type ProfilesAction } from "../profiles";
import { createProfile } from "../storage";
import { ProfileEditor } from "./ProfileEditor";

type Props = {
  profiles: Profile[];
  dispatch: (action: ProfilesAction) => void;
  onPick: (id: string) => void;
};

type Editing = { mode: "add" } | { mode: "edit"; profile: Profile } | null;

const tileClass =
  "group flex w-28 cursor-pointer flex-col items-center gap-2 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-32";
const avatarClass =
  "relative grid aspect-square w-full place-items-center rounded-3xl glass font-emoji text-5xl transition group-hover:scale-105 group-hover:bg-white/15 sm:text-6xl";

/** Full-screen "Who's playing?" chooser with profile management. */
export const ProfilePicker = ({ profiles, dispatch, onPick }: Props) => {
  const [managing, setManaging] = useState(false);
  const [editing, setEditing] = useState<Editing>(null);

  const submit = ({ name, avatar }: { name: string; avatar: Avatar }) => {
    if (editing?.mode === "edit") {
      dispatch({ type: "edit", id: editing.profile.id, name, avatar });
    } else {
      dispatch({ type: "add", profile: createProfile(name, avatar) });
    }
    setEditing(null);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 py-10">
      <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
        {managing ? "Manage profiles" : "Who's playing?"}
      </h1>

      <ul className="flex max-w-3xl flex-wrap justify-center gap-4 sm:gap-6">
        {profiles.map((profile) => {
          const found = Object.keys(profile.save.collection).length;
          return (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() =>
                  managing ? setEditing({ mode: "edit", profile }) : onPick(profile.id)
                }
                aria-label={managing ? `Edit ${profile.name}` : `Play as ${profile.name}`}
                className={tileClass}
              >
                <span aria-hidden className={avatarClass}>
                  {profile.avatar}
                  {managing && (
                    <span className="absolute inset-0 grid place-items-center rounded-3xl bg-ink/55 font-display text-2xl">
                      ✎
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate font-semibold">{profile.name}</span>
                <span className="-mt-2 text-xs text-white/50 tabular-nums">
                  {found} / {TOTAL_EMOJIS}
                </span>
              </button>
            </li>
          );
        })}
        {profiles.length < MAX_PROFILES && (
          <li>
            <button type="button" onClick={() => setEditing({ mode: "add" })} className={tileClass}>
              <span
                aria-hidden
                className={`${avatarClass} border-dashed font-display text-4xl text-white/60`}
              >
                +
              </span>
              <span className="font-semibold text-white/80">Add profile</span>
            </button>
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setManaging((value) => !value)}
        className="cursor-pointer rounded-full border border-white/30 px-5 py-2 text-sm font-semibold tracking-wide text-white/80 uppercase transition outline-none hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-white"
      >
        {managing ? "Done" : "Manage profiles"}
      </button>

      {editing && (
        <ProfileEditor
          profile={editing.mode === "edit" ? editing.profile : undefined}
          canDelete={profiles.length > 1}
          onSubmit={submit}
          onDelete={() => {
            if (editing.mode === "edit") dispatch({ type: "remove", id: editing.profile.id });
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </main>
  );
};
