import { UIButton, UIInlineActions, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFilterFormProps } from "./catalog-saved-filter-form-props.type";

export function CatalogSavedFilterForm(props: CatalogSavedFilterFormProps) {
  const { t } = useTranslation();

  const [name, setName] = useState("");

  const trimmedName = name.trim();

  const save = async (): Promise<void> => {
    if (!trimmedName) {
      return;
    }

    await props.onSave(trimmedName);

    setName("");
  };

  return (
    <UIInlineActions wrap>
      <UITextField
        fullWidth
        label={t("catalog.savedFilterName")}
        onChange={(event) => setName(event.target.value)}
        placeholder={t("catalog.savedFilterPlaceholder")}
        value={name}
      />
      <UIButton disabled={!trimmedName || props.saving} onClick={save} variant="contained">
        {t("catalog.saveFilter")}
      </UIButton>
    </UIInlineActions>
  );
}
