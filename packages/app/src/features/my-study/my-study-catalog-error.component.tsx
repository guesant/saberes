import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";

export type MyStudyCatalogErrorProps = {
  error: Error;
  onRetry: () => Promise<void>;
};

export function MyStudyCatalogError(props: MyStudyCatalogErrorProps) {
  const { t } = useTranslation();

  return (
    <ContentErrorState
      error={props.error}
      label={t("errors.catalogLoad")}
      onRetry={props.onRetry}
    />
  );
}
