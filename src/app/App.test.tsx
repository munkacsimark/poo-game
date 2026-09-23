import { createMemoryHistory } from "@tanstack/react-router";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { seedProfiles, storedSave } from "../test/profileStorage";
import { stubRandomWords } from "../test/stubRandomWords";
import { App } from "./App";

const grid = () => screen.queryByRole("list", { name: "Your collection" });
const stage = () => screen.getByRole("button", { name: /^Push the/ });
const savedClicks = () => storedSave().clicks;

/** Renders the app at `path` (without the /poo-game/ base) and waits for the route to render. */
const renderApp = async (path = "/") => {
  const history = createMemoryHistory({ initialEntries: [path] });
  const result = render(<App history={history} />);
  await screen.findByRole("main");
  return { ...result, history };
};

// jsdom drops the whitespace between inline children when computing names, browsers keep it.
describe("App", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts a new player with one common emoji", async () => {
    await renderApp();
    expect(
      within(screen.getByRole("list", { name: "Your collection" })).getAllByRole("button"),
    ).toHaveLength(1);
  });

  it("drops a new emoji after enough pushes and persists it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    // Zero rolls: one push is enough and the drop is always 💩.
    stubRandomWords(0);
    await renderApp();

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
    await renderApp();

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
    await renderApp();

    await user.click(screen.getByRole("button", { name: "🦄, 2 collected" }));
    expect(screen.getByRole("button", { name: "Push the 🦄" })).toBeInTheDocument();
  });

  it("stays silent when muted and remembers the setting", async () => {
    const user = userEvent.setup();
    const play = vi.spyOn(HTMLMediaElement.prototype, "play");
    const { unmount } = await renderApp();

    await user.click(screen.getByRole("button", { name: "Sound", pressed: true }));
    play.mockClear();
    await user.click(screen.getByRole("button", { name: /^Push the/ }));
    expect(play).not.toHaveBeenCalled();

    unmount();
    await renderApp();
    expect(
      await screen.findByRole("button", { name: "Sound", pressed: false }),
    ).toBeInTheDocument();
  });

  it("filters the collection by rarity", async () => {
    const user = userEvent.setup();
    seedProfiles({ name: "Ann", save: { collection: { "🍟": 1, "🦄": 2 } } });
    await renderApp();

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
    const { history } = await renderApp();

    expect(await screen.findByRole("heading", { name: "Who's playing?" })).toBeInTheDocument();
    expect(history.location.pathname).toBe("/profiles");
    await user.click(screen.getByRole("button", { name: /^Play\s*as\s*Bo\s*,/ }));
    expect(await screen.findByRole("button", { name: "Push the 🍟" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Switch profile (Bo)" }));
    await user.click(await screen.findByRole("button", { name: /^Play\s*as\s*Ann\s*,/ }));
    expect(await screen.findByRole("button", { name: "Push the 🦄" })).toBeInTheDocument();
    expect(storedSave().clicks).toBe(5);
  });

  it("adds, renames and deletes profiles", async () => {
    const user = userEvent.setup();
    await renderApp("/profiles");

    await user.click(screen.getByRole("link", { name: "Add profile" }));
    const dialog = await screen.findByRole("dialog", { name: "Add profile" });
    await user.type(within(dialog).getByRole("textbox", { name: "Name" }), "Cy");
    await user.click(within(dialog).getByRole("radio", { name: "🤖" }));
    await user.click(within(dialog).getByRole("button", { name: "Add profile" }));
    expect(await screen.findByRole("button", { name: /^Play\s*as\s*Cy\s*,/ })).toHaveTextContent(
      "🤖",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Manage profiles" }));
    await user.click(await screen.findByRole("link", { name: /^Edit\s*Cy\s*,/ }));
    const editor = await screen.findByRole("dialog", { name: "Edit profile" });
    await user.click(within(editor).getByRole("button", { name: "Delete profile" }));
    await user.click(within(editor).getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("heading", { name: "Manage profiles" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Edit\s*Cy\s*,/ })).not.toBeInTheDocument();

    // The last profile can't be deleted.
    await user.click(screen.getByRole("link", { name: /^Edit\s*Player\s*1\s*,/ }));
    await screen.findByRole("dialog", { name: "Edit profile" });
    expect(screen.queryByRole("button", { name: "Delete profile" })).not.toBeInTheDocument();
  });

  describe("routing", () => {
    it("opens the FAQ over the game and closes it with Back", async () => {
      const user = userEvent.setup();
      const { history } = await renderApp();

      await user.click(screen.getByRole("link", { name: "FAQ" }));
      expect(await screen.findByRole("dialog", { name: "FAQ" })).toBeInTheDocument();
      expect(history.location.pathname).toBe("/faq");
      expect(stage()).toBeInTheDocument();

      act(() => history.back());
      await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expect(history.location.pathname).toBe("/");
    });

    it("closing a deep-linked dialog replaces it instead of leaving the app", async () => {
      const user = userEvent.setup();
      const { history } = await renderApp("/changelog");

      const dialog = await screen.findByRole("dialog", { name: "What's new" });
      await user.click(within(dialog).getByRole("button", { name: "Close" }));
      await vi.waitFor(() => expect(history.location.pathname).toBe("/"));
      expect(history.length).toBe(1);
    });

    it("opens manage mode and profile dialogs from their URLs", async () => {
      const [ann] = seedProfiles({ name: "Ann" }, { name: "Bo" });
      await renderApp(`/profiles/manage/${ann?.id}`);

      expect(await screen.findByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Manage profiles" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ann");
    });

    it("sends stale profile links back to manage mode", async () => {
      const { history } = await renderApp("/profiles/manage/gone");
      await vi.waitFor(() => expect(history.location.pathname).toBe("/profiles/manage"));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("shows a not-found page for unknown URLs", async () => {
      const user = userEvent.setup();
      await renderApp("/nope");

      expect(await screen.findByRole("heading", { name: "Nothing to see here" })).toBeVisible();
      await user.click(screen.getByRole("link", { name: "Back to the game" }));
      expect(await screen.findByRole("button", { name: /^Push the/ })).toBeInTheDocument();
    });
  });
});
