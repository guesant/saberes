import { useTranslation } from "react-i18next";
import { MyStudyCatalogError } from "./my-study-catalog-error.component";
import { MyStudyProgressError } from "./my-study-progress-error.component";

export interface MyStudyReadyFeedbackProps {
  catalogError: Error | null;
  onRetry(): Promise<void>;
  progressError: Error | null;
}

export function MyStudyReadyFeedback(props: MyStudyReadyFeedbackProps) {
  const { t } = useTranslation();

  return (
    <>
      {props.catalogError ? (
        <MyStudyCatalogError error={props.catalogError} onRetry={props.onRetry} />
      ) : null}
      {props.progressError ? (
        <MyStudyProgressError
          error={props.progressError}
          label={t("errors.progressLoad")}
          onRetry={props.onRetry}
        />
      ) : null}
    </>
  );
}
