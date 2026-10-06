import { UISectionNavigation } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type TopicPrimaryActionsProps = {
  activeSection: number;
  navigateToSection(index: number): void;
};

export function TopicPrimaryActions(props: TopicPrimaryActionsProps) {
  const { t } = useTranslation();

  return (
    <UISectionNavigation
      activeId={["teoria", "pratica", "materiais"][props.activeSection]}
      ariaLabel={t("topics.sectionNavigation")}
      items={[
        {
          id: "teoria",
          iconName: "materials",
          label: t("discovery.theory"),
        },
        {
          id: "pratica",
          iconName: "question",
          label: t("discovery.practice"),
        },
        {
          id: "materiais",
          iconName: "materials",
          label: t("discovery.materialsShort"),
        },
      ]}
      onNavigate={(id) => {
        return props.navigateToSection(["teoria", "pratica", "materiais"].indexOf(id));
      }}
    />
  );
}
