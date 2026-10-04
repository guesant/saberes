import { UILink } from "@guesant/saberes-ui";
import type { LessonSourceLinkProps } from "./lesson-source-link-props.type";

export function LessonSourceLink(props: LessonSourceLinkProps) {
  return (
    <UILink href={props.url} target="_blank" rel="noreferrer">
      {props.title}
    </UILink>
  );
}
