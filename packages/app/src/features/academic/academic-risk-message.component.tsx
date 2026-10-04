import { UITypography } from "@guesant/saberes-ui";

export interface AcademicRiskMessageProps {
  active: boolean | undefined;
  message: string;
}

export function AcademicRiskMessage(props: AcademicRiskMessageProps) {
  if (!props.active) {
    return null;
  }

  return <UITypography color="error.main">{props.message}</UITypography>;
}
