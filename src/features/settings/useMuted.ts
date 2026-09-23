import { useEffect, useState } from "react";
import { readJson, writeJson } from "../../shared/lib/storage";

const MUTED_KEY = "poo-game:muted";

/** Sound on/off, remembered across visits. */
export const useMuted = () => {
  const [muted, setMuted] = useState(() => readJson(MUTED_KEY) === true);

  useEffect(() => {
    writeJson(MUTED_KEY, muted);
  }, [muted]);

  return [muted, () => setMuted((value) => !value)] as const;
};
