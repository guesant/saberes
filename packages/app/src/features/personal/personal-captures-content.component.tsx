import { UIList } from "@guesant/saberes-ui";
import { getOrderedStudyCaptures } from "./get-ordered-study-captures.function";
import { getPersonalCapturesForFilter } from "./get-personal-captures-for-filter.function";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { PersonalCaptureListItem } from "./personal-capture-list-item.component";
import type { PersonalCapturesContentProps } from "./personal-captures-content-props.interface";

export function PersonalCapturesContent(props: PersonalCapturesContentProps) {
  const captures = getPersonalCapturesForFilter(props.workspace.captures, props.filter);

  return (
    <>
      <UIList>
        {getOrderedStudyCaptures(captures)
          .map((capture) => {
            return (
              <PersonalCaptureListItem
                capture={capture}
                key={capture.id}
                onDelete={props.onDelete}
                onUpdateArchive={props.onUpdateArchive}
                onUpdateCompletion={props.onUpdateCompletion}
                onUpdateContent={props.onUpdateContent}
              />
            );
          })}
      </UIList>
      {captures.some((capture) => {
        return capture.archived;
      }) ? (
          <PersonalArchivedList
            items={captures.filter((capture) => {
              return capture.archived;
            })}
            onRestore={props.onRestore}
            title="Arquivadas"
          />
        ) : null}
    </>
  );
}
