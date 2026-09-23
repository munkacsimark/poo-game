import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/index.css";

// Dev server only: console helpers for sealed storage (tree-shaken from production builds).
if (import.meta.env.DEV) void import("./dev/devTools");

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
