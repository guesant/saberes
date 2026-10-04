import { UIExploreIcon, UIInputAdornment, UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogSearchFieldProps } from "./catalog-search-field-props.type";

export function CatalogSearchField(props: CatalogSearchFieldProps) {
  const { t } = useTranslation();

  return (
    <UITextField
      fullWidth
      placeholder={t("catalog.searchPlaceholder")}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      InputProps={{
        startAdornment: (
          <UIInputAdornment position="start">
            <UIExploreIcon />
          </UIInputAdornment>
        ),
      }}
    />
  );
}
