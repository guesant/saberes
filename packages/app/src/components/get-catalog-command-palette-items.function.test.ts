import { CatalogCardType, type CatalogReadModel } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getCatalogCommandPaletteItems } from "./get-catalog-command-palette-items.function";

const catalog: CatalogReadModel = {
  content: [
    {
      description: "Leia a teoria",
      id: "lesson-1",
      title: "Introdução",
      type: CatalogCardType.Lesson,
    },
  ],
  courses: [
    {
      id: "course-1",
      title: "Curso local",
      type: CatalogCardType.Course,
    },
  ],
  maps: [],
  plans: [],
};

describe("getCatalogCommandPaletteItems", () => {
  it("retorna uma lista vazia sem catálogo local", () => {
    expect(getCatalogCommandPaletteItems(undefined))
      .toEqual([]);
  });

  it("combina cursos, mapas, planos e conteúdo em uma lista navegável", () => {
    expect(getCatalogCommandPaletteItems(catalog))
      .toEqual([
        {
          description: undefined,
          id: "catalog:course:course-1",
          label: "Curso local",
          value: "/cursos/course-1",
        },
        {
          description: "Leia a teoria",
          id: "catalog:lesson:lesson-1",
          label: "Introdução",
          value: "/licoes/lesson-1",
        },
      ]);
  });
});
