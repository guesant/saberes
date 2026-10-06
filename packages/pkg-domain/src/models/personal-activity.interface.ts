import type { ContentReference } from "./content-reference.type";
import type { PersonalActivityStatus } from "./personal-activity-status.type";

export interface PersonalActivity {
  id: string;
  sourceCaptureId?: string;
  contentReference?: ContentReference;
  title: string;
  description: string;
  status: PersonalActivityStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
