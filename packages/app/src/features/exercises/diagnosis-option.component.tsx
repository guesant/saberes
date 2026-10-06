import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { DiagnosisOption } from "./diagnosis-option.type";

export type DiagnosisOptionProps = {
  option: DiagnosisOption;
  selected: boolean;
  onSelect(code: DiagnosisOption["code"]): void;
};

export function DiagnosisOption(props: DiagnosisOptionProps) {
  const { option, onSelect } = props;

  const { t } = useTranslation();

  return (
    <UIButton
      aria-pressed={props.selected}
      variant={props.selected ? "contained" : "outlined"}
      onClick={() => {
        return onSelect(option.code);
      }}
    >
      {t(option.labelKey)}
    </UIButton>
  );
}
