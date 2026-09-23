import { useCloseRoute } from "../../../shared/lib/useCloseRoute";
import { useProfiles } from "../ProfilesProvider";
import { createProfile } from "../storage";
import { ProfileEditor } from "./ProfileEditor";

/** /profiles/new: the "Add profile" dialog over the picker. */
export const NewProfile = () => {
  const { dispatch } = useProfiles();
  const close = useCloseRoute("/profiles");

  return (
    <ProfileEditor
      canDelete={false}
      onSubmit={({ name, avatar }) => {
        dispatch({ type: "add", profile: createProfile(name, avatar) });
        close();
      }}
      onClose={close}
    />
  );
};
