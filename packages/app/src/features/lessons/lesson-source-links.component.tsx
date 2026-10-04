import { LessonSourceLink } from "./lesson-source-link.component";
import type { LessonSourceLinksProps } from "./lesson-source-links-props.type";

export function LessonSourceLinks(props: LessonSourceLinksProps) {
  return (
    <>
      {props.data.sources.map((source) => {
        return (
          <LessonSourceLink
            key={String(source.url)}
            title={String(source.title || source.url)}
            url={String(source.url)}
          />
        );
      })}
    </>
  );
}
