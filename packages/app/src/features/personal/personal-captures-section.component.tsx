import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { getOrderedStudyCaptures } from "./get-ordered-study-captures.function";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { StudyCaptureItem } from "./study-capture-item.component";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalCapturesSectionProps {
  workspace: PersonalWorkspace;
  onUpdateCompletion(id: string): Promise<void>;

  onUpdateArchive(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalCapturesSection(props: PersonalCapturesSectionProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Pendências</UITypography>
      <UIList>
        {getOrderedStudyCaptures(props.workspace.captures)
          .filter((capture) => !capture.archived)
          .map((capture) => (
            <StudyCaptureItem
              capture={capture}
              key={capture.id}
              onDelete={props.onDelete}
              onUpdateContent={props.onUpdateContent}
              onUpdateArchive={props.onUpdateArchive}
              onUpdateCompletion={props.onUpdateCompletion}
            />
          ))}
      </UIList>
      {props.workspace.captures.some((capture) => capture.archived) ? (
        <PersonalArchivedList
          items={props.workspace.captures.filter((capture) => capture.archived)}
          onRestore={props.onRestore}
          title="Arquivadas"
        />
      ) : null}
    </UIContentGroup>
  );
}
