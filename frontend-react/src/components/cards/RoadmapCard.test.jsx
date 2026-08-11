import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import RoadmapCard from "./RoadmapCard";

vi.mock("../ui/BookmarkButton", () => ({
  default: () => <button type="button">Bookmark</button>,
}));

function renderRoadmap(title) {
  render(
    <MemoryRouter>
      <RoadmapCard
        roadmap={{
          id: 43,
          title,
          short_description: "Learn relational databases.",
          difficulty: { name: "Advanced" },
          duration: "12–18 Weeks",
          steps_count: 247,
        }}
      />
    </MemoryRouter>
  );
}

describe("RoadmapCard", () => {
  it("decodes HTML entities in the title and accessible link name", () => {
    renderRoadmap("SQL &amp; Database Developer");

    expect(
      screen.getByRole("heading", {
        name: "SQL & Database Developer",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Open roadmap: SQL & Database Developer",
      })
    ).toHaveAttribute("href", "/roadmap/43");
  });

  it("supports WordPress numeric ampersand entities", () => {
    renderRoadmap("React &#038; TypeScript");

    expect(
      screen.getByRole("heading", {
        name: "React & TypeScript",
      })
    ).toBeInTheDocument();
  });
});
