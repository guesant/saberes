import { StudyCaptureItem } from "./study-capture-item.component";
import type { PersonalCaptureListItemProps } from "./personal-capture-list-item-props.interface";

export function PersonalCaptureListItem(props: PersonalCaptureListItemProps) {
  if (props.capture.archived) {
    return null;
  }

  return (
    <StudyCaptureItem
      capture={props.capture}
      onDelete={props.onDelete}
      onUpdateArchive={props.onUpdateArchive}
      onUpdateCompletion={props.onUpdateCompletion}
      onUpdateContent={props.onUpdateContent}
      selection={props.selection}
    />
  );
}
