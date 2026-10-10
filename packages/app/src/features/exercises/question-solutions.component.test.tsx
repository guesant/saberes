// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { QuestionSolutions } from "./question-solutions.component";

vi.mock("react-i18next", () => {
  return {
    useTranslation() {
      return {
        t(key: string) {
          return key;
        },
      };
    },
  };
});

afterEach(() => {
  cleanup();
});

it("renders existing commentary with provenance and an explicit published status", () => {
  render(
    <QuestionSolutions
      solutions={[
        {
          id: 1,
          title: "Resolução cadastrada",
          content: "## Raciocínio\n\nCalculamos a área pela base e altura.",
          position: 0,
          sourceUrl: "https://www.comvest.unicamp.br/commentary.pdf",
          sourceTitle: "Documento Comvest",
        },
      ]}
    />,
  );

  expect(screen.getByRole("heading", { name: "Raciocínio" }))
    .toBeTruthy();

  expect(screen.getByText("editorial.status.published"))
    .toBeTruthy();

  expect(screen.getByText("exercise.solutionEditorialNotice"))
    .toBeTruthy();

  expect(screen.getByRole("link", { name: "Documento Comvest" })
    .getAttribute("href"))
    .toContain("commentary.pdf");
});

it.each([
  ["draft", "editorial.status.draft"],
  ["review", "editorial.status.review"],
])("labels a %s solution and keeps it available for consultation", (editorialStatus, label) => {
  render(
    <QuestionSolutions
      solutions={[
        {
          id: 2,
          title: "Resolução editorial",
          content: "Conteúdo ainda consultável.",
          position: 0,
          editorialStatus: editorialStatus as "draft" | "review",
        },
      ]}
    />,
  );

  expect(screen.getByText(label))
    .toBeTruthy();

  expect(screen.getByText("Conteúdo ainda consultável."))
    .toBeTruthy();
});

it("does not invent a commentary or source when absent", () => {
  const { container } = render(<QuestionSolutions />);

  expect(container.firstChild)
    .toBeNull();
});
