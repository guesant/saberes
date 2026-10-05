import { UIButton, UIQuickAccessCard, UIQuickAccessGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { MyStudyQuickAccessCardProps } from "./my-study-quick-access-card-props.interface";

export function MyStudyQuickAccessCard(props: MyStudyQuickAccessCardProps) {
  const { t } = useTranslation();

  return (
    <UIQuickAccessGridItem>
      <UIQuickAccessCard description={props.description} icon={props.icon} title={props.title}>
        <UIButton component={Link} size="small" to={props.to} variant="outlined">
          {t("common.open")}
        </UIButton>
      </UIQuickAccessCard>
    </UIQuickAccessGridItem>
  );
}
