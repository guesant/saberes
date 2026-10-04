import { UITypography } from "@guesant/saberes-ui";

export interface GoalItemSummaryProps {
  title: string;
  progress: string;
  details: string;
}

export function GoalItemSummary(props: GoalItemSummaryProps) {
  return (
    <>
      <UITypography variant="h6">{props.title}</UITypography>
      <UITypography color="text.secondary">{props.progress}</UITypography>
      <UITypography color="text.secondary">{props.details}</UITypography>
    </>
  );
}
