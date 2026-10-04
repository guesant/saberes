import { UIPaper } from "@guesant/saberes-ui";
import { LessonEditorialMetadata } from "./lesson-editorial-metadata.component";
import type { LessonEditorialMetadataPanelProps } from "./lesson-editorial-metadata-panel-props.type";

export function LessonEditorialMetadataPanel(props: LessonEditorialMetadataPanelProps) {
  return (
    <UIPaper variant="outlined">
      <LessonEditorialMetadata data={props.data} />
    </UIPaper>
  );
}
