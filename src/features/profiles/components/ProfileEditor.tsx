import { useState } from "react";
import { Modal } from "../../../shared/ui/Modal";
import { AVATARS, MAX_NAME_LENGTH, type Avatar, type Profile } from "../profiles";

type Props = {
  /** The profile to edit, or undefined to create one. */
  profile?: Profile;
  canDelete: boolean;
  onSubmit: (values: { name: string; avatar: Avatar }) => void;
  onDelete?: () => void;
  onExport?: () => void;
  onClose: () => void;
};

const buttonClass =
  "cursor-pointer rounded-pill px-4 py-2 text-sm font-semibold transition duration-300 ease-spring outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95";

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
          <div className="flex animate-rise-in flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Delete {profile?.name} and all their progress?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className={`${buttonClass} glass hover:bg-fg/15`}
              >
                Keep
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={`${buttonClass} bg-red-700 text-white hover:bg-red-800`}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
              {profile && canDelete && onDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className={`${buttonClass} text-danger hover:bg-danger/15`}
                >
                  Delete profile
                </button>
              )}
              {profile && onExport && (
                <button
                  type="button"
                  onClick={onExport}
                  className={`${buttonClass} text-fg/80 hover:bg-fg/10`}
                >
                  Export
                </button>
              )}
            </div>
            <button
              type="submit"
              form={formId}
              className={`${buttonClass} bg-accent text-on-accent hover:bg-accent/85`}
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
            className="rounded-xl border border-fg/15 bg-fg/5 px-3 py-2 text-base font-normal outline-none focus-visible:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </label>
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 text-sm font-medium">Avatar</legend>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((avatar, index) => (
              <label
                key={avatar}
                className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-fg/10 bg-fg/5 font-emoji text-2xl transition duration-300 ease-spring hover:scale-105 hover:bg-fg/10 active:scale-90 has-checked:scale-110 has-checked:border-accent has-checked:bg-fg/20 has-checked:shadow-[0_0_20px_-4px_var(--color-accent)] has-focus-visible:ring-2 has-focus-visible:ring-accent"
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
