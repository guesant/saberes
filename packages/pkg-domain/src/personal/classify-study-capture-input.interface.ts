import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ClassifyStudyCaptureInput {
  workspace: PersonalWorkspace;
  captureId: string;
  targetId: string;
  targetType: "note" | "activity";
  now: string;
}
