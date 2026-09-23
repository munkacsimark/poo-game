import { Link, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { TOTAL_EMOJIS } from "../../collection/collection";
import { MAX_PROFILES } from "../profiles";
import { decodeProfile, ProfileFileError } from "../profileFile";
import { useProfiles } from "../ProfilesProvider";
import { createProfile } from "../storage";

type Notice = { kind: "success" | "error"; text: string } | null;

const tileClass =
  "group flex w-28 cursor-pointer flex-col items-center gap-2 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-32";
const outlineButtonClass =
  "cursor-pointer rounded-full border border-white/30 px-5 py-2 text-sm font-semibold tracking-wide text-white/80 uppercase transition outline-none hover:not-disabled:border-white hover:not-disabled:text-white focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40";
const avatarClass =
  "relative grid aspect-square w-full place-items-center rounded-3xl glass font-emoji text-5xl transition group-hover:scale-105 group-hover:bg-white/15 sm:text-6xl";

type TileActionProps = {
  managing: boolean;
  profileId: string;
  onPick: () => void;
  children: ReactNode;
};

/** Picking plays as the profile; in manage mode the tile links to its edit dialog. */
const TileAction = ({ managing, profileId, onPick, children }: TileActionProps) =>
  managing ? (
    <Link to="/profiles/manage/$profileId" params={{ profileId }} className={tileClass}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onPick} className={tileClass}>
      {children}
    </button>
  );

/**
 * "Who's playing?" (/profiles) and "Manage profiles" (/profiles/manage). The add and edit
 * dialogs are child routes rendered through the `<Outlet />`.
 */
export const ProfilePicker = () => {
  const { profiles, dispatch, pick } = useProfiles();
  const navigate = useNavigate();
  const managing = Boolean(useMatchRoute()({ to: "/profiles/manage", fuzzy: true }));
  const [notice, setNotice] = useState<Notice>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const full = profiles.length >= MAX_PROFILES;

  const importFile = async (file: File) => {
    try {
      const { name, avatar, save } = await decodeProfile(await file.text());
      dispatch({ type: "add", profile: { ...createProfile(name, avatar), save } });
      setNotice({ kind: "success", text: `Imported ${name}.` });
    } catch (error) {
      const text =
        error instanceof ProfileFileError ? error.message : "That file couldn't be read.";
      setNotice({ kind: "error", text });
    }
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
              <TileAction
                managing={managing}
                profileId={profile.id}
                onPick={() => {
                  pick(profile.id);
                  void navigate({ to: "/" });
                }}
              >
                <span aria-hidden className={avatarClass}>
                  {profile.avatar}
                  {managing && (
                    <span className="absolute inset-0 grid place-items-center rounded-3xl bg-ink/55 font-display text-2xl">
                      ✎
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate font-semibold">
                  <span className="sr-only">{managing ? "Edit " : "Play as "}</span>
                  {profile.name}
                </span>
                <span className="-mt-2 text-xs text-white/50 tabular-nums">
                  <span className="sr-only">, </span>
                  {found} / {TOTAL_EMOJIS}
                  <span className="sr-only"> found</span>
                </span>
              </TileAction>
            </li>
          );
        })}
        {!full && (
          <li>
            <Link to="/profiles/new" className={tileClass}>
              <span
                aria-hidden
                className={`${avatarClass} border-dashed font-display text-4xl text-white/60`}
              >
                +
              </span>
              <span className="font-semibold text-white/80">Add profile</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to={managing ? "/profiles" : "/profiles/manage"} className={outlineButtonClass}>
          {managing ? "Done" : "Manage profiles"}
        </Link>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={full}
          title={full ? `Up to ${MAX_PROFILES} profiles; delete one to import another.` : undefined}
          className={outlineButtonClass}
        >
          Import profile
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".poo,text/plain,application/octet-stream"
          aria-label="Profile file to import"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void importFile(file);
          }}
        />
      </div>
      <p
        role={notice?.kind === "error" ? "alert" : "status"}
        className={`-mt-6 min-h-5 text-center text-sm ${notice?.kind === "error" ? "text-red-300" : "text-white/70"}`}
      >
        {notice?.text}
      </p>

      <Outlet />
    </main>
  );
};
