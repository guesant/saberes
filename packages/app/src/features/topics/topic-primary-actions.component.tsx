import { UISectionNavigation } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useTopicSectionNavigation } from "./use-topic-section-navigation.hook";

export function TopicPrimaryActions() {
  const { t } = useTranslation();

  const { activeSection, navigateToSection } = useTopicSectionNavigation();

  return (
    <UISectionNavigation
      activeId={["teoria", "pratica", "materiais"][activeSection]}
      ariaLabel={t("topics.sectionNavigation")}
      items={[
        { id: "teoria", label: t("discovery.theory") },
        { id: "pratica", label: t("discovery.practice") },
        { id: "materiais", label: t("discovery.materialsShort") },
      ]}
      onNavigate={(id) => {
        return navigateToSection(["teoria", "pratica", "materiais"].indexOf(id));
      }}
    />
  );
}
