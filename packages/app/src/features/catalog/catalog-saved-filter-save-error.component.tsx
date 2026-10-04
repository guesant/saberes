import { UIContentAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFilterSaveErrorProps } from "./catalog-saved-filter-save-error-props.type";

export function CatalogSavedFilterSaveError(props: CatalogSavedFilterSaveErrorProps) {
  const { t } = useTranslation();

  if (!props.error) {
    return null;
  }

  return (
    <UIContentAlert severity="error">
      {t("catalog.savedFilterSaveError", { message: props.error.message })}
    </UIContentAlert>
  );
}
