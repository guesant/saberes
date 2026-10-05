import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogSavedFilterEditDialog } from "./catalog-saved-filter-edit-dialog.component";
import type { CatalogSavedFilterItemProps } from "./catalog-saved-filter-item-props.type";

export function CatalogSavedFilterItem(props: CatalogSavedFilterItemProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton
        onClick={() => {
          return props.onSelect(props.filter);
        }}
        size="small"
        variant="outlined"
      >
        {props.filter.name}
      </UIButton>
      <CatalogSavedFilterEditDialog
        filter={props.filter}
        onSave={props.onUpdate}
        title={t("catalog.editSavedFilter")}
        triggerLabel={t("catalog.editSavedFilter")}
      />
      <UIButton
        onClick={() => {
          return props.onDelete(props.filter.id);
        }}
        size="small"
        variant="text"
      >
        {t("catalog.deleteSavedFilter")}
      </UIButton>
    </UIInlineActions>
  );
}
