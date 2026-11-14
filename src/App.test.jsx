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

  it("links to the HTML CV and keeps demos out of the main navigation", () => {
    render(<App />);
    const nav = within(screen.getByRole("navigation", { name: "Main navigation" }));
    for (const name of ["Research", "Publications"]) {
      const id = nav.getByRole("link", { name }).getAttribute("href").slice(1);
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(nav.queryByRole("link", { name: "Demos" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Neural Equation Demos" })).toHaveAttribute("href", "/neural-equation-demos/");
    expect(nav.getByRole("link", { name: "CV" })).toHaveAttribute("href", "/cv/");
    expect(nav.getByRole("link", { name: "CV" })).not.toHaveAttribute("download");
  });

  it("renders publication titles with paper links", () => {
    render(<App />);
    const publications = within(screen.getByRole("region", { name: "Publications" }));
    expect(screen.getByRole("link", { name: "IEEE ICDM Best Paper Award" }))
      .toHaveAttribute("href", "https://icdm2026.neu.edu.cn/");
    const entries = publications.getAllByRole("listitem");
    expect(entries).toHaveLength(7);
    for (const entry of entries) {
      const paper = within(entry).getByRole("link", { name: /^Paper for / });
      const code = within(entry).queryByRole("link", { name: /^Code for / });
      expect(paper).toHaveAttribute("href", entry.querySelector("h3 a").getAttribute("href"));
      if (code) expect(paper.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(entry.querySelector(".publication-summary")).toHaveTextContent(/.+\.$/);
    }
    expect(publications.getByRole("link", { name: /^Fredholm Integral Equations/ }))
      .toHaveAttribute("href", "https://doi.org/10.1088/3049-4761/ae4983");
  });
});
