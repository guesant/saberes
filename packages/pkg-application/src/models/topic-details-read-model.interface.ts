export interface TopicDetailsReadModel {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent_id: number | null;
}
