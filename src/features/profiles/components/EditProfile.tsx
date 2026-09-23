import { Navigate } from "@tanstack/react-router";
import { downloadText } from "../../../shared/lib/download";
import { useCloseRoute } from "../../../shared/lib/useCloseRoute";
import { encodeProfile, profileFileName } from "../profileFile";
import { useProfiles } from "../ProfilesProvider";
import { ProfileEditor } from "./ProfileEditor";

/** /profiles/manage/$profileId: rename, re-avatar, export or delete one profile. */
export const EditProfile = ({ profileId }: { profileId: string }) => {
  const { profiles, dispatch } = useProfiles();
  const close = useCloseRoute("/profiles/manage");
  const profile = profiles.find(({ id }) => id === profileId);

  // A stale link, or the profile was just deleted.
  if (!profile) return <Navigate to="/profiles/manage" replace />;

  return (
    <ProfileEditor
      profile={profile}
      canDelete={profiles.length > 1}
      onSubmit={({ name, avatar }) => {
        dispatch({ type: "edit", id: profile.id, name, avatar });
        close();
      }}
      onDelete={() => {
        dispatch({ type: "remove", id: profile.id });
        close();
      }}
      onExport={() => {
        void encodeProfile(profile).then((file) =>
          downloadText(profileFileName(profile.name), file),
        );
      }}
      onClose={close}
    />
  );
};
