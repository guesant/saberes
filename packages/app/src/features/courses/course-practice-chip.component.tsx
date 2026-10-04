import { UIChip } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

type CoursePracticeChipProps = {
  itemType: unknown;
};

export function CoursePracticeChip(props: CoursePracticeChipProps) {
  const { t } = useTranslation();

  return <UIChip label={String(props.itemType || t("course.practice"))} size="small" />;
}
