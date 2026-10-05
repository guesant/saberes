import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalCaptureFilterControls } from "./personal-capture-filter-controls.component";
import { PersonalCapturesContent } from "./personal-captures-content.component";
import type { PersonalCaptureFilter } from "./personal-capture-filter.type";
import type { PersonalCapturesContentProps } from "./personal-captures-content-props.interface";

export interface PersonalCapturesSectionProps
  extends Omit<PersonalCapturesContentProps, "filter"> {}

export function PersonalCapturesSection(props: PersonalCapturesSectionProps) {
  const [filter, setFilter] = useState<PersonalCaptureFilter>("active");

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Pendências</UITypography>
      <PersonalCaptureFilterControls onChange={setFilter} value={filter} />
      <PersonalCapturesContent
        filter={filter}
        onDelete={props.onDelete}
        onRestore={props.onRestore}
        onUpdateArchive={props.onUpdateArchive}
        onUpdateCompletion={props.onUpdateCompletion}
        onUpdateContent={props.onUpdateContent}
        selection={props.selection}
        workspace={props.workspace}
      />
    </UIContentGroup>
  );
}
