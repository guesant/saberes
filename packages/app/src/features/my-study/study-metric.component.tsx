import { UICard, UICardContent, UITypography } from "@guesant/saberes-ui";

export type StudyMetricProps = {
  label: string;
  value: number;
};

export function StudyMetric(props: StudyMetricProps) {
  return (
    <UICard>
      <UICardContent>
        <UITypography variant="h5">{props.value}</UITypography>
        <UITypography color="text.secondary">{props.label}</UITypography>
      </UICardContent>
    </UICard>
  );
}
