import { StudyChecklistEntry } from "./study-checklist-entry.component";
import type { StudyChecklistEntriesProps } from "./study-checklist-entries-props.interface";
import type { ReactElement } from "react";

export function StudyChecklistEntries(props: StudyChecklistEntriesProps): ReactElement {
  return (
    <>
      {props.checklist.items.map((item, index) => {
        return (
          <StudyChecklistEntry
            canMoveDown={index < props.checklist.items.length - 1}
            canMoveUp={index > 0}
            key={item.id}
            label={item.label}
            onMoveDown={() => { return props.onMoveItem(props.checklist.id, item.id, "down"); }}
            onMoveUp={() => { return props.onMoveItem(props.checklist.id, item.id, "up"); }}
            onUpdate={() => { return props.onUpdateItem(props.checklist.id, item.id); }}
          />
        );
      })}
    </>
  );
}
