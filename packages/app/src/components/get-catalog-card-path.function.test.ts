import { CatalogCardType, type CatalogCard } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getCatalogCardPath } from "./get-catalog-card-path.function";

describe("getCatalogCardPath", () => {
  it("prioriza o endereço editorial explícito", () => {
    const card: CatalogCard = {
      href: "/estudo/personalizado",
      id: "course-id",
      title: "Curso",
      type: CatalogCardType.Course,
    };

    expect(getCatalogCardPath(card))
      .toBe("/estudo/personalizado");
  });

  it("cria rotas locais por tipo e slug", () => {
    const card: CatalogCard = {
      id: 42,
      slug: "funcoes",
      title: "Funções",
      type: CatalogCardType.Lesson,
    };

    expect(getCatalogCardPath(card))
      .toBe("/licoes/funcoes");
  });

  it("usa o id quando o card não possui slug", () => {
    const card: CatalogCard = {
      id: 7,
      title: "Questão",
      type: CatalogCardType.Question,
    };

    expect(getCatalogCardPath(card))
      .toBe("/questoes/7");
  });
});
