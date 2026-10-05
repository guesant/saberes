import { UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalCaptureFilterChip } from "./personal-capture-filter-chip.component";
import type { PersonalCaptureFilterControlsProps } from "./personal-capture-filter-controls-props.interface";

export function PersonalCaptureFilterControls(props: PersonalCaptureFilterControlsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <PersonalCaptureFilterChip
        filter="active"
        label={t("personal.filters.active")}
        onChange={props.onChange}
        selected={props.value === "active"}
      />
      <PersonalCaptureFilterChip
        filter="archived"
        label={t("personal.filters.archived")}
        onChange={props.onChange}
        selected={props.value === "archived"}
      />
      <PersonalCaptureFilterChip
        filter="all"
        label={t("personal.filters.all")}
        onChange={props.onChange}
        selected={props.value === "all"}
      />
    </UIInlineActions>
  );
}
