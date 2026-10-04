import { useState } from "react";
import type { StudyChecklistEditingState } from "./study-checklist-editing-state.interface";
import type { StudyChecklist } from "@guesant/saberes-application";

export function useStudyChecklistEditingState(
  _checklist: StudyChecklist,
): StudyChecklistEditingState {
  const [editing, setEditing] = useState(false);

  return { editing, setEditing };
}
