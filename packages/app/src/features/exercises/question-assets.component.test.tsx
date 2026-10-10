import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { QuestionAssets } from "./question-assets.component";

afterEach(() => {return cleanup();});

describe("QuestionAssets", () => {
  it("opens an accessible PDF page from an official caderno", () => {
    render(
      <QuestionAssets
        pdfPages={[
          {
            occurrenceId: 420,
            path: "official-pdfs/2026/QX.pdf",
            page: 3,
            year: 2026,
            editionSlug: "unicamp-2026",
            paperVersionCode: "QX",
            paperVersionName: "Modelos Q e X",
            paperName: "Prova da primeira fase — Vestibular Unicamp 2026",
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Abrir página 3 · 2026 · QX" }))
      .toBeTruthy();
  });

  it("does not render extracted question crops", () => {
    render(
      <QuestionAssets
        pdfPages={[]}
      />,
    );

    expect(screen.queryByRole("img"))
      .toBeNull();
  });

  it("does not render when there are no PDF pages", () => {
    const { container } = render(<QuestionAssets pdfPages={[]} />);

    expect(container.firstChild)
      .toBeNull();
  });
});
