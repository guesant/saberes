import { useCallback, useState } from "react";
import { moveToTopicSection } from "./move-to-topic-section.function";
import { useSyncTopicSectionScroll } from "./use-sync-topic-section-scroll.hook";

const topicSectionIds = ["teoria", "pratica", "materiais"] as const;

export function useTopicSectionNavigation() {
  const [activeSection, setActiveSection] = useState(0);

  useSyncTopicSectionScroll(setActiveSection);

  const navigateToSection = useCallback((index: number): void => {
    const sectionId = topicSectionIds[index];

    if (!sectionId) {
      return;
    }

    setActiveSection(index);

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`,
    );

    moveToTopicSection(sectionId);
  }, []);

  return { activeSection, navigateToSection };
}
