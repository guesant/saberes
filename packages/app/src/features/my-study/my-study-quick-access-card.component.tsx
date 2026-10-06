import { UIQuickAccessCard, UIQuickAccessGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { MyStudyQuickAccessCardProps } from "./my-study-quick-access-card-props.interface";

export function MyStudyQuickAccessCard(props: MyStudyQuickAccessCardProps) {
  const { t } = useTranslation();

  return (
    <UIQuickAccessGridItem>
      <UIQuickAccessCard
        action={<Link aria-label={`${t("common.open")}: ${props.title}`} to={props.to} />}
        actionLabel={t("common.open")}
        description={props.description}
        icon={props.icon}
        title={props.title}
      />
    </UIQuickAccessGridItem>
  );
}
