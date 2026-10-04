import { CatalogCardType, type CatalogCard } from "@guesant/saberes-application";

const catalogPathSegments = {
  [CatalogCardType.Course]: "cursos",
  [CatalogCardType.Map]: "mapa",
  [CatalogCardType.Plan]: "plano",
  [CatalogCardType.Question]: "questoes",
  [CatalogCardType.Lesson]: "licoes",
  [CatalogCardType.Resource]: "licoes",
};

export function getCatalogCardPath(card: CatalogCard): string {
  if (card.href) {
    return card.href;
  }

  const identifier = String(card.slug || card.id);

  const segment = catalogPathSegments[card.type] || catalogPathSegments[CatalogCardType.Lesson];

  return `/${segment}/${identifier}`;
}
