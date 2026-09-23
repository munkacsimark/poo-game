import { RouterProvider, type RouterHistory } from "@tanstack/react-router";
import { useState } from "react";
import { createAppRouter } from "./router";

/** `history` is for tests (a memory history); the app uses the browser's. */
export const App = ({ history }: { history?: RouterHistory }) => {
  const [router] = useState(() => createAppRouter(history));
  return <RouterProvider router={router} />;
};
