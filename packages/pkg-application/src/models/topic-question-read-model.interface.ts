export interface TopicQuestionReadModel {
  id: number;
  slug: string;
  number: number | null;
  statement: string;
  difficulty: string;
  href: string;
}
