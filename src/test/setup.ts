import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom implements neither media playback nor the Web Animations API.
HTMLMediaElement.prototype.play = vi.fn<HTMLMediaElement["play"]>(() => Promise.resolve());
Element.prototype.animate = vi.fn<Element["animate"]>();

afterEach(() => {
  cleanup();
  localStorage.clear();
});
