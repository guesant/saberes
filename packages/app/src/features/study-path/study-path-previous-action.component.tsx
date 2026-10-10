import { UIFormAction } from "@guesant/saberes-ui";
import type { StudyPathActionProps as StudyPathPreviousActionProps } from "./study-path-action-props.interface";

export function StudyPathPreviousAction(props: StudyPathPreviousActionProps) {
  if (!props.href) {
    return null;
  }

  return <UIFormAction href={props.href}>Passo anterior</UIFormAction>;
}
