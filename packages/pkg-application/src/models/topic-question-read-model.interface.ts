export interface TopicQuestionReadModel {
  id: number;
  slug: string;
  number: number | null;
  statement: string;
  difficulty: string;
  href: string;
  sourceEditionYear?: number;
  sourceStageName?: string;
  sourcePaperName?: string;
  sourceBookletName?: string;
  classificationType: "primary" | "secondary" | "related";
  classificationConfidence?: number | null;
  classificationSourceTitle?: string;
  classificationSourceUrl?: string;
  classificationSourcePage?: number;
  classificationSourceExcerpt?: string;
}
