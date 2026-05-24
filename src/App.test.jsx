import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App, { navItems, PROFILE_PHOTO_SRC, publications, researchAreas, scrollToId } from "./App.jsx";

describe("Haoyang personal homepage", () => {
  it("renders the hero section without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("homepage-root")).toBeInTheDocument();
    expect(screen.getByText("Building AI for open physical systems.")).toBeInTheDocument();
  });

  it("uses a white page background", () => {
    render(<App />);
    expect(screen.getByTestId("homepage-root")).toHaveClass("bg-white");
  });

  it("renders the profile photo with the expected source", () => {
    render(<App />);
    const photo = screen.getByAltText("Portrait of Haoyang Jiang");
    expect(photo).toBeInTheDocument();
    expect(photo.getAttribute("src")).toBe(PROFILE_PHOTO_SRC);
  });

  it("defines all main navigation items", () => {
    expect(navItems).toHaveLength(5);
    expect(navItems.map((item) => item.label)).toEqual(["Mission", "Research", "Projects", "Publications", "Contact"]);
  });

  it("renders all research areas", () => {
    render(<App />);
    expect(researchAreas).toHaveLength(4);
    for (const area of researchAreas) expect(screen.getByText(area[1])).toBeInTheDocument();
  });

  it("renders selected publications", () => {
    render(<App />);
    expect(publications).toHaveLength(3);
    expect(screen.getByText(/Fredholm Integral Equations Neural Operator/i)).toBeInTheDocument();
  });

  it("scrollToId safely no-ops when target does not exist", () => {
    expect(() => scrollToId("missing-target")).not.toThrow();
  });

  it("scrollToId calls scrollIntoView when an element exists", () => {
    const div = document.createElement("div");
    div.id = "target";
    div.scrollIntoView = vi.fn();
    document.body.appendChild(div);
    scrollToId("target");
    expect(div.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    document.body.removeChild(div);
  });
});
