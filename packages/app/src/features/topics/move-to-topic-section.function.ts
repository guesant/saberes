export function moveToTopicSection(sectionId: string): void {
  const main = document.getElementById("main-content");

  const section = document.getElementById(sectionId);

  if (!main || !section) {
    return;
  }

  const top =
    main.scrollTop + section.getBoundingClientRect().top - main.getBoundingClientRect().top;

  main.scrollTo({ top, behavior: "smooth" });
}
