import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StageBackground } from "./StageBackground";

describe("StageBackground", () => {
  it("serves responsive AVIF and WebP sources over an inline placeholder", () => {
    const { container } = render(<StageBackground emoji="🦄" />);

    const sources = container.querySelectorAll("source");
    expect([...sources].map((source) => source.type)).toEqual(["image/avif", "image/webp"]);
    expect(sources[0]?.getAttribute("srcset")).toMatch(/ 480w,.* 1600w$/);
    expect(container.querySelector<HTMLElement>("[style]")?.style.backgroundImage).toMatch(
      /^url\("?data:image\/webp;base64,/,
    );
  });

  it("fades the full image in once it has loaded", () => {
    const { container } = render(<StageBackground emoji="🦄" />);
    const img = container.querySelector("img");
    if (!img) throw new Error("missing img");

    expect(img).toHaveClass("opacity-0");
    fireEvent.load(img);
    expect(img).toHaveClass("opacity-100");
  });

  it("blurs out when the emoji changes", () => {
    const animate = vi.spyOn(Element.prototype, "animate");
    const { rerender } = render(<StageBackground emoji="🦄" />);
    expect(animate).not.toHaveBeenCalled();

    rerender(<StageBackground emoji="💩" />);
    expect(animate).toHaveBeenCalledOnce();
  });
});
