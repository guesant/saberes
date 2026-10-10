import { UIFormAction } from "@guesant/saberes-ui";
import { StudyPathEnd } from "./study-path-end.component";
import type { StudyPathActionProps as StudyPathNextActionProps } from "./study-path-action-props.interface";

export function StudyPathNextAction(props: StudyPathNextActionProps) {
  if (!props.href) {
    return <StudyPathEnd />;
  }

  return <UIFormAction href={props.href}>Próximo passo</UIFormAction>;
}
