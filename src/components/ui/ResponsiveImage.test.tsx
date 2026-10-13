import { render, screen } from "@testing-library/react";
import { ResponsiveImage } from "./ResponsiveImage";

describe("ResponsiveImage", () => {
  it("serves mobile by default and lets the browser switch to tablet and desktop", () => {
    const { container } = render(
      <ResponsiveImage
        mobile="/m.svg"
        tablet="/t.svg"
        desktop="/d.svg"
        alt="A red car"
      />
    );

    expect(screen.getByRole("img", { name: "A red car" })).toHaveAttribute(
      "src",
      "/m.svg"
    );

    const sources = Array.from(container.querySelectorAll("source")).map(
      (source) => [source.media, source.srcset]
    );
    expect(sources).toEqual([
      ["(min-width: 1024px)", "/d.svg"],
      ["(min-width: 640px)", "/t.svg"],
    ]);
  });
});
