import { UIExploreIcon, UIInputAdornment, UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogSearchFieldProps } from "./catalog-search-field-props.type";

export function CatalogSearchField(props: CatalogSearchFieldProps) {
  const { t } = useTranslation();

  return (
    <UITextField
      aria-label={t("catalog.searchLabel")}
      placeholder={t("catalog.searchPlaceholder")}
      value={props.value}
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
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
