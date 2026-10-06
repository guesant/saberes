import { CatalogCardType, type CatalogReadModel } from "@guesant/saberes-application";
import type { AutocompleteOption } from "@guesant/saberes-ui";

const typeLabels: Record<string, string> = {
  assessment: "Simulado",
  course: "Curso",
  lesson: "Lição",
  plan: "Plano de estudo",
  question: "Questão",
};

export function createCatalogContentReferenceOptions(catalog: CatalogReadModel): AutocompleteOption[] {
  const items = [...catalog.courses, ...catalog.plans, ...catalog.content];

  return items.flatMap((item) => {
    const id = item.type === CatalogCardType.Question ? String(item.id) : item.slug;

    if (!id || !typeLabels[item.type]) {
      return [];
    }

    return [{ label: `${typeLabels[item.type]} · ${item.title}`, value: `${item.type}:${id}` }];
  });
}
