import { UIForm, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFilterEditFormProps } from "./catalog-saved-filter-edit-form-props.interface";
import type { FormEvent } from "react";

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

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await save();
  };

  return (
    <UIForm id={props.formId} onSubmit={submit}>
      <UITextField
        label={t("catalog.savedFilterName")}
        onChange={(event) => {
          return setName(event.target.value);
        }}
        required
        value={name}
      />
    </UIForm>
  );
}
