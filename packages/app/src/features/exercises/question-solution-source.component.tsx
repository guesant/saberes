import { UIButton } from "@guesant/saberes-ui";

export type QuestionSolutionSourceProps = {
  url?: string | null;
  title?: string | null;
};

export function QuestionSolutionSource(props: QuestionSolutionSourceProps) {
  if (!props.url) {
    return null;
  }

  return (
    <UIButton href={props.url} target="_blank" rel="noopener noreferrer" variant="text">
      {props.title || "Consultar a fonte da resolução"}
    </UIButton>
  );
}
