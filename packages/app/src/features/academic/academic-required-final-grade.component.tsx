import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface AcademicRequiredFinalGradeProps {
  value: number | null | undefined;
}

export function AcademicRequiredFinalGrade(props: AcademicRequiredFinalGradeProps) {
  const { t } = useTranslation();

  if (props.value === null || props.value === undefined) {
    return null;
  }

  return (
    <UITypography color="text.secondary">
      {t("academic.requiredFinalGrade", { value: props.value })}
    </UITypography>
  );
}
