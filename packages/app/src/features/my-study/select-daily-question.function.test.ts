import { CatalogCardType, type CatalogCard } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { selectDailyQuestion } from "./select-daily-question.function";

const content: CatalogCard[] = [
  { id: 1, title: "Curso", type: CatalogCardType.Course },
  { id: 2, title: "Questão A", type: CatalogCardType.Question },
  { id: 3, title: "Questão B", type: CatalogCardType.Question },
];

describe("seleção da questão do dia", () => {
  it("seleciona uma questão de forma determinística", () => {
    const date = new Date("2026-10-03T12:00:00.000Z");

    expect(selectDailyQuestion({ content, date }))
      .toEqual(selectDailyQuestion({ content, date }));
  });

  it("retorna vazio quando não há questões publicadas", () => {
    expect(
      selectDailyQuestion({
        content: [content[0]],
        date: new Date("2026-10-03T12:00:00.000Z"),
      }),
    )
      .toBeNull();
  });
});
