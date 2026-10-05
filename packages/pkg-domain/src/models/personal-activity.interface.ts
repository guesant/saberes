import type { ContentKey } from "./content-key.type";
import type { PersonalActivityStatus } from "./personal-activity-status.type";

export interface PersonalActivity {
  id: string;
  sourceCaptureId?: string;
  contentKey?: ContentKey | string;
  title: string;
  description: string;
  status: PersonalActivityStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
