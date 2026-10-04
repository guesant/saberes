import { UITypography } from "@guesant/saberes-ui";

export type ContentReleaseNotesProps = {
  notes: string;
};

export function ContentReleaseNotes(props: ContentReleaseNotesProps) {
  return (
    <UITypography color="text.secondary" variant="body2">
      {props.notes}
    </UITypography>
  );
}
