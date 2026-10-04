import { CatalogCardType } from "@guesant/saberes-application";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MyStudyFirstStudyPrompt } from "./my-study-first-study-prompt.component";
import type { CatalogCard, ContentReleaseReadModel } from "@guesant/saberes-application";

afterEach(() => {
  cleanup();
});

const course: CatalogCard = {
  id: 1,
  slug: "curso-sintetico-primeiro-estudo",
  title: "Primeiro estudo",
  type: CatalogCardType.Course,
};

const release: ContentReleaseReadModel = {
  generatedAt: "2026-10-04T00:00:00.000Z",
  notes: "Fixture local",
  schemaVersion: 1,
  source: "synthetic-fixture",
  version: "fixture-local-1",
};

describe("MyStudyFirstStudyPrompt", () => {
  it("exibe o ciclo local e as ações de retomada", () => {
    render(<MyStudyFirstStudyPrompt course={course} release={release} />);

    expect(screen.getByText("Primeiro estudo local")).toBeTruthy();

    expect(screen.getByRole("link", { name: "Continuar primeiro estudo" })).toHaveAttribute(
      "href",
      "/cursos/curso-sintetico-primeiro-estudo",
    );

    expect(screen.getByRole("link", { name: "Restaurar dados locais" })).toHaveAttribute(
      "href",
      "/meu-estudo#dados-locais",
    );
  });

  it("não aparece para releases editoriais", () => {
    render(
      <MyStudyFirstStudyPrompt
        course={course}
        release={{ ...release, source: "content.sqlite" }}
      />,
    );

    expect(screen.queryByText("Primeiro estudo local")).toBeNull();
  });
});
