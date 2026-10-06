import { UITypography } from "@guesant/saberes-ui";
import { useContentReferenceOptions } from "./use-content-reference-options.hook";

export interface ContentReferenceLabelProps {
  value: string;
}

export function ContentReferenceLabel(props: ContentReferenceLabelProps) {
  const catalog = useContentReferenceOptions();

  const label = catalog.options.find((option) => { return option.value === props.value; })?.label;

  const separator = props.value.indexOf(":");

  const type = props.value.slice(0, separator);

  const id = props.value.slice(separator + 1);

  const fallbackType = {
    assessment: "Simulado",
    course: "Curso",
    lesson: "Lição",
    plan: "Plano de estudo",
    question: "Questão",
    topic: "Tópico",
  }[type] ?? "Conteúdo";

  return <UITypography color="text.secondary" variant="body2">{label ?? `${fallbackType} · ${id}`}</UITypography>;
}
