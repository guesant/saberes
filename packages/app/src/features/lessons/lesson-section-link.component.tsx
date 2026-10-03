import { ListItemButton, ListItemText } from "@guesant/saberes-ui";

export type LessonSectionLinkProps = {
  section: Record<string, unknown>;
  index: number;
};

export function LessonSectionLink(props: LessonSectionLinkProps) {
  const { section, index } = props;

  return (
    <ListItemButton component="a" href={`#section-${String(section.id)}`}>
      <ListItemText primary={`${index + 1}. ${String(section.title || "Conteúdo")}`} />
    </ListItemButton>
  );
}
