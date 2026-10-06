import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const topicSectionIds = ["teoria", "pratica", "materiais"] as const;

export function useTopicSectionNavigation() {
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(() => {
    const index = topicSectionIds.indexOf(
      window.location.hash.slice(1) as (typeof topicSectionIds)[number],
    );

    return index >= 0 ? index : 0;
  });

  useEffect(() => {
    const index = topicSectionIds.indexOf(
      location.hash.slice(1) as (typeof topicSectionIds)[number],
    );

    setActiveSection(index >= 0 ? index : 0);
  }, [location.hash, location.pathname]);

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
  }, []);

  return { activeSection, navigateToSection };
}
