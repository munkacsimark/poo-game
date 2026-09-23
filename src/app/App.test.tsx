import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts a new player with one common emoji", () => {
    render(<App />);
    expect(
      within(screen.getByRole("list", { name: "Your collection" })).getAllByRole("button"),
    ).toHaveLength(1);
  });

  it("drops a new emoji after enough pushes and persists it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    // With a zero roll one push is enough and the drop is always 💩.
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Push the/ }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("button", { name: "Push the 💩" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "💩, 1 collected" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("poo-game:save") ?? "{}")).toMatchObject({
      selected: "💩",
      clicks: 1,
    });
  });

  it("selects an emoji from the collection", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "poo-game:save",
      JSON.stringify({ version: 1, selected: "🍟", clicks: 0, collection: { "🍟": 1, "🦄": 2 } }),
    );
    render(<App />);

    await user.click(screen.getByRole("button", { name: "🦄, 2 collected" }));
    expect(screen.getByRole("button", { name: "Push the 🦄" })).toBeInTheDocument();
  });
});
