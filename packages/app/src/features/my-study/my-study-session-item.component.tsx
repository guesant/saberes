import { useNavigate } from "react-router-dom";
import { MyStudySessionActions } from "./my-study-session-actions.component";
import { MyStudySessionDetails } from "./my-study-session-details.component";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionItemProps = {
  session: StudySession;
};

export function MyStudySessionItem(props: MyStudySessionItemProps) {
  const navigate = useNavigate();

  const handleResumeStudySession = (): void => {
    navigate(`/sessoes/questoes/${props.session.id}`);
  };

  return (
    <>
      <MyStudySessionDetails session={props.session} />
      <MyStudySessionActions onResume={handleResumeStudySession} session={props.session} />
    </>
  );
}
