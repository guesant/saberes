import { useTranslation } from "react-i18next";
import { ContentReferenceField } from "../../components/content-reference-field.component";

export interface PersonalContentKeyFieldProps {
  disabled?: boolean;
  value: string;
  label?: string;
  onChange(value: string): void;
}

export function PersonalContentKeyField(props: PersonalContentKeyFieldProps) {
  const { t } = useTranslation();

  return (
    <ContentReferenceField
      label={props.label ?? t("personal.relatedContent")}
      disabled={props.disabled}
      onChange={props.onChange}
      value={props.value}
    />
  );
}
