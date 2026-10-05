import { UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface PersonalContentKeyFieldProps {
  value: string;
  onChange(value: string): void;
}

export function PersonalContentKeyField(props: PersonalContentKeyFieldProps) {
  const { t } = useTranslation();

  return (
    <UITextField
      label={t("personal.relatedContent")}
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
      value={props.value}
    />
  );
}
