import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App, { PROFILE_PHOTO_SRC } from "./App.jsx";

describe("Haoyang Jiang's academic homepage", () => {
  it("renders the name, affiliation, and portrait", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Haoyang Jiang" })).toBeInTheDocument();
    expect(screen.getByText("Ph.D. Candidate in Data Science")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait of Haoyang Jiang" })).toHaveAttribute("src", PROFILE_PHOTO_SRC);
  });

  it("links each navigation item to a section, the demos, or the CV", () => {
    render(<App />);
    const nav = within(screen.getByRole("navigation", { name: "Main navigation" }));
    for (const name of ["Research", "Publications"]) {
      const id = nav.getByRole("link", { name }).getAttribute("href").slice(1);
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(nav.getByRole("link", { name: "Demos" })).toHaveAttribute("href", "/neural-equation-demos/");
    expect(nav.getByRole("link", { name: "CV" }).getAttribute("href")).toMatch(/Haoyang_Jiang_CV\.pdf$/);
  });

  it("renders publication titles with paper links", () => {
    render(<App />);
    const publications = within(screen.getByRole("region", { name: "Selected Publications" }));
    expect(publications.getAllByRole("listitem")).toHaveLength(6);
    expect(publications.getByRole("link", { name: /Fredholm Integral Equations/ }))
      .toHaveAttribute("href", "https://arxiv.org/abs/2408.12389");
  });
});
