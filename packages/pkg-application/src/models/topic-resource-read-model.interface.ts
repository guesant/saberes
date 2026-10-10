export interface TopicResourceReadModel {
  id: number;
  title: string;
  description: string;
  url: string;
  kind: string;
  provider: string;
  isExternal: boolean;
  editorialStatus?: "draft" | "review" | "published";
  editorialNote?: string;
  availabilityMode?: "learning" | "practice" | "consultation_only" | "reference";
  relationStatus?: "draft" | "review" | "published";
  relevanceStatus?: "unknown" | "relevant" | "not_relevant";
  accessibilityStatus?: "unknown" | "checked" | "needs_improvement";
  relationNote?: string;
  reuseStatus?: "unknown" | "link_only" | "open_license" | "public_domain" | "permission_confirmed";
  licenseName?: string;
  licenseUrl?: string;
  attribution?: string;
  rightsNote?: string;
}
