import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom implements neither media playback, the Web Animations API nor matchMedia.
HTMLMediaElement.prototype.play = vi.fn<HTMLMediaElement["play"]>(() => Promise.resolve());
Element.prototype.animate = vi.fn<Element["animate"]>();
window.matchMedia = vi.fn<typeof window.matchMedia>((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
});
