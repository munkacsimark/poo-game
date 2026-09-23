import { useCanGoBack, useNavigate, useRouter, type LinkProps } from "@tanstack/react-router";

/**
 * Closes a dialog route like the browser's Back button would: steps back in history when the
 * dialog was opened inside the app, otherwise (opened from a link or bookmark) replaces the
 * entry with `fallback`, so Back never leaves the dialog open behind you.
 */
export const useCloseRoute = (fallback: LinkProps["to"]) => {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  return () => {
    if (canGoBack) router.history.back();
    else void navigate({ to: fallback, replace: true });
  };
};
