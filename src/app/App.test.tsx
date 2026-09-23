import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { seedProfiles, storedSave } from "../test/profileStorage";
import { stubRandomWords } from "../test/stubRandomWords";
import { App } from "./App";

const grid = () => screen.queryByRole("list", { name: "Your collection" });
const stage = () => screen.getByRole("button", { name: /^Push the/ });
const savedClicks = () => storedSave().clicks;

// jsdom drops the whitespace between inline children when computing names, browsers keep it.
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
    // Zero rolls: one push is enough and the drop is always 💩.
    stubRandomWords(0);
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Push the/ }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("button", { name: "Push the 💩" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Push the 💩" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("💩New Galaxy Opal!");
    expect(screen.getByRole("button", { name: "💩, 1 collected, new" })).toBeInTheDocument();
    expect(storedSave()).toMatchObject({ selected: "💩", clicks: 1 });
  });

  it("ignores taps until the poo has dropped and the new emoji is revealed", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const zeroRolls = stubRandomWords(0);
    render(<App />);

    await user.click(stage());
    expect(stage()).toHaveAttribute("aria-disabled", "true");
    await user.click(stage());
    expect(savedClicks()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await user.click(stage());
    expect(savedClicks()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(stage()).toHaveAttribute("aria-disabled", "false");
    // A zero roll can't pick anything but the selected 💩, so let the next drop roll for real.
    zeroRolls.mockRestore();
    await user.click(stage());
    expect(savedClicks()).toBe(2);
  });

  it("selects an emoji from the collection", async () => {
    const user = userEvent.setup();
    seedProfiles({ name: "Ann", save: { collection: { "🍟": 1, "🦄": 2 } } });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "🦄, 2 collected" }));
    expect(screen.getByRole("button", { name: "Push the 🦄" })).toBeInTheDocument();
  });

  it("stays silent when muted and remembers the setting", async () => {
    const user = userEvent.setup();
    const play = vi.spyOn(HTMLMediaElement.prototype, "play");
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Sound", pressed: true }));
    play.mockClear();
    await user.click(screen.getByRole("button", { name: /^Push the/ }));
    expect(play).not.toHaveBeenCalled();

    unmount();
    render(<App />);
    expect(screen.getByRole("button", { name: "Sound", pressed: false })).toBeInTheDocument();
  });

  it("filters the collection by rarity", async () => {
    const user = userEvent.setup();
    seedProfiles({ name: "Ann", save: { collection: { "🍟": 1, "🦄": 2 } } });
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^Mythic\s*1\s*of\s*4$/ }));
    expect(within(grid()!).getAllByRole("button")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /^Epic\s*0\s*of/ }));
    expect(grid()).not.toBeInTheDocument();
    expect(screen.getByText("No Epic emojis yet. Keep pushing!")).toBeInTheDocument();
  });

  it("asks who's playing when there are several profiles, each with its own progress", async () => {
    const user = userEvent.setup();
    seedProfiles(
      { name: "Ann", save: { selected: "🦄", clicks: 5, collection: { "🦄": 1 } } },
      { name: "Bo", save: { selected: "🍟", clicks: 9 } },
    );
    render(<App />);

    expect(screen.getByRole("heading", { name: "Who's playing?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Play as Bo" }));
    expect(stage()).toHaveAccessibleName("Push the 🍟");

    await user.click(screen.getByRole("button", { name: "Switch profile (Bo)" }));
    await user.click(screen.getByRole("button", { name: "Play as Ann" }));
    expect(stage()).toHaveAccessibleName("Push the 🦄");
    expect(storedSave().clicks).toBe(5);
  });

  it("adds, renames and deletes profiles", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Switch profile (Player 1)" }));
    await user.click(screen.getByRole("button", { name: "Add profile" }));
    const dialog = screen.getByRole("dialog", { name: "Add profile" });
    await user.type(within(dialog).getByRole("textbox", { name: "Name" }), "Cy");
    await user.click(within(dialog).getByRole("radio", { name: "🤖" }));
    await user.click(within(dialog).getByRole("button", { name: "Add profile" }));
    expect(screen.getByRole("button", { name: "Play as Cy" })).toHaveTextContent("🤖");

    await user.click(screen.getByRole("button", { name: "Manage profiles" }));
    await user.click(screen.getByRole("button", { name: "Edit Cy" }));
    const editor = screen.getByRole("dialog", { name: "Edit profile" });
    await user.click(within(editor).getByRole("button", { name: "Delete profile" }));
    await user.click(within(editor).getByRole("button", { name: "Delete" }));
    expect(screen.queryByRole("button", { name: "Edit Cy" })).not.toBeInTheDocument();

    // The last profile can't be deleted.
    await user.click(screen.getByRole("button", { name: "Edit Player 1" }));
    expect(screen.queryByRole("button", { name: "Delete profile" })).not.toBeInTheDocument();
  });
});
