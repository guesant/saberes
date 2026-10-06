import { moveToTopicSection } from "./move-to-topic-section.function";

const topicSectionIds = ["teoria", "pratica", "materiais"] as const;

type TopicSectionIndexSetter = (index: number) => void;

export function registerTopicSectionScroll(setActiveSection: TopicSectionIndexSetter) {
  const main = document.getElementById("main-content");

  if (!main) {
    return () => {};
  }

  const updateActiveSection = (): void => {
    const marker = main.getBoundingClientRect().top + 120;

    let index = -1;

    topicSectionIds.forEach((id, candidateIndex) => {
      const section = document.getElementById(id);

      if (section && section.getBoundingClientRect().top <= marker) {index = candidateIndex;}
    });

    if (index >= 0) {setActiveSection(index);}
  };

  const syncHash = (): void => {
    const index = topicSectionIds.indexOf(window.location.hash.slice(1) as (typeof topicSectionIds)[number]);

    if (index < 0) {return;}

    setActiveSection(index);

    moveToTopicSection(topicSectionIds[index]);
  };

  main.addEventListener("scroll", updateActiveSection);

  window.addEventListener("hashchange", syncHash);

  if (window.location.hash) {syncHash();}
  else {updateActiveSection();}

  return () => {
    main.removeEventListener("scroll", updateActiveSection);

    window.removeEventListener("hashchange", syncHash);
  };
}
