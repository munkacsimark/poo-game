const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Edits one base64url character so the decoded bytes really change: it flips the character's
 * highest bit, which is always data (the lowest bits of the last character can be padding).
 */
export const flipBase64Char = (text: string, index: number): string => {
  const at = ALPHABET.indexOf(text.charAt(index));
  if (at === -1) throw new Error(`Not a base64url character at ${index}`);
  return text.slice(0, index) + ALPHABET.charAt(at ^ 32) + text.slice(index + 1);
};
