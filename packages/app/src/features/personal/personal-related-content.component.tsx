import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface PersonalRelatedContentProps {
  value: string;
}

export function PersonalRelatedContent(props: PersonalRelatedContentProps) {
  const { t } = useTranslation();

  return (
    <UITypography color="text.secondary" variant="body2">
      {t("personal.relatedContentValue", { value: props.value })}
    </UITypography>
  );
}
