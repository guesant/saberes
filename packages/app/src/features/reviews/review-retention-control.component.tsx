import { UIContentGroup, UITextField, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { ReviewRetentionControlProps } from "./review-retention-control-props.type";

export function ReviewRetentionControl(props: ReviewRetentionControlProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h6">{t("review.retentionTitle")}</UITypography>
      <UITypography color="text.secondary">{t("review.retentionDescription")}</UITypography>
      <UITextField
        inputProps={{ max: 99, min: 80, step: 1 }}
        label={t("review.retentionLabel")}
        onChange={(event) => {
          return props.onChange(Number(event.target.value) / 100);
        }}
        type="number"
        value={Math.round(props.retention * 100)}
      />
    </UIContentGroup>
  );
}
