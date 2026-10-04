import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type TopicMapProgressErrorProps = {
  error: Error | null;
};

export function TopicMapProgressError(props: TopicMapProgressErrorProps) {
  const { t } = useTranslation();

  if (!props.error) {
    return null;
  }

  return (
    <UIAlert severity="warning">{t("map.progressError", { message: props.error.message })}</UIAlert>
  );
}
