import { UIButton, UIInlineActions, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFilterEditFormProps } from "./catalog-saved-filter-edit-form-props.interface";

export function CatalogSavedFilterEditForm(props: CatalogSavedFilterEditFormProps) {
  const { t } = useTranslation();

  const [name, setName] = useState(props.initialName);

  const trimmedName = name.trim();

  const save = async (): Promise<void> => {
    if (!trimmedName) {
      return;
    }

    await props.onSave(trimmedName);
  };

  return (
    <UIInlineActions wrap>
      <UITextField
        label={t("catalog.savedFilterName")}
        onChange={(event) => { return setName(event.target.value); }}
        value={name}
      />
      <UIButton disabled={!trimmedName} onClick={save} variant="contained">
        {t("catalog.updateFilter")}
      </UIButton>
    </UIInlineActions>
  );
}
