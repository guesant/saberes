import { canResumeStudySession } from "./can-resume-study-session.function";
import { MyStudySessionResumeAction } from "./my-study-session-resume-action.component";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionActionsProps = {
  session: StudySession;
  onResume: () => void;
};

export function MyStudySessionActions(props: MyStudySessionActionsProps) {
  if (!canResumeStudySession(props.session)) {
    return null;
  }

  return <MyStudySessionResumeAction onResume={props.onResume} />;
}
