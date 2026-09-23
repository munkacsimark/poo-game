import { useState } from "react";
import { Modal } from "../../../shared/ui/Modal";
import { AVATARS, MAX_NAME_LENGTH, type Avatar, type Profile } from "../profiles";

type Props = {
  /** The profile to edit, or undefined to create one. */
  profile?: Profile;
  canDelete: boolean;
  onSubmit: (values: { name: string; avatar: Avatar }) => void;
  onDelete: () => void;
  onExport: () => void;
  onClose: () => void;
};

const buttonClass =
  "cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-white";

/** Create or edit a profile: name, avatar, and (when editing) deletion. */
export const ProfileEditor = ({
  profile,
  canDelete,
  onSubmit,
  onDelete,
  onExport,
  onClose,
}: Props) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const formId = profile ? `edit-${profile.id}` : "new-profile";

  return (
    <Modal
      title={profile ? "Edit profile" : "Add profile"}
      onClose={onClose}
      footer={
        confirmingDelete ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Delete {profile?.name} and all their progress?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className={`${buttonClass} glass hover:bg-white/15`}
              >
                Keep
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={`${buttonClass} bg-red-500/80 text-white hover:bg-red-500`}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
              {profile && canDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className={`${buttonClass} text-red-300 hover:bg-red-500/15`}
                >
                  Delete profile
                </button>
              )}
              {profile && (
                <button
                  type="button"
                  onClick={onExport}
                  className={`${buttonClass} text-white/80 hover:bg-white/10`}
                >
                  Export
                </button>
              )}
            </div>
            <button
              type="submit"
              form={formId}
              className={`${buttonClass} bg-white text-ink hover:bg-white/85`}
            >
              {profile ? "Save" : "Add profile"}
            </button>
          </div>
        )
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-5 pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = data.get("name");
          const avatar = AVATARS.find((option) => option === data.get("avatar")) ?? AVATARS[0];
          onSubmit({ name: typeof name === "string" ? name : "", avatar });
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <input
            name="name"
            required
            // showModal() moves focus to the autofocus element: start typing right away.
            // oxlint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            maxLength={MAX_NAME_LENGTH}
            defaultValue={profile?.name}
            autoComplete="off"
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-base font-normal outline-none focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </label>
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 text-sm font-medium">Avatar</legend>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((avatar, index) => (
              <label
                key={avatar}
                className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/5 font-emoji text-2xl transition has-checked:border-white has-checked:bg-white/20 has-focus-visible:ring-2 has-focus-visible:ring-white"
              >
                <input
                  type="radio"
                  name="avatar"
                  value={avatar}
                  defaultChecked={profile ? profile.avatar === avatar : index === 0}
                  className="sr-only"
                />
                {avatar}
              </label>
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
};
