import { UICommandPalette } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { ShellCommandPaletteProps } from "./shell-command-palette-props.interface";

export function ShellCommandPalette(props: ShellCommandPaletteProps) {
  const { t } = useTranslation();

  return (
    <UICommandPalette
      emptyLabel={t("common.commandPaletteEmpty")}
      inputLabel={t("common.commandPalettePlaceholder")}
      items={props.items}
      onClose={props.onClose}
      onQueryChange={props.onQueryChange}
      onSelect={props.onSelect}
      open={props.open}
      query={props.query}
      title={t("common.commandPalette")}
    />
  );
}
