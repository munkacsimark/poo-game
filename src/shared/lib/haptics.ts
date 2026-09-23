/** Vibrates on devices that support it (Android browsers); a no-op elsewhere, including iOS. */
export const vibrate = (pattern: number | number[]): void => {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
};
