import { UIAutocomplete } from "@guesant/saberes-ui";
import { useContentReferenceOptions } from "./use-content-reference-options.hook";

export interface ContentReferenceFieldProps {
  value: string;
  label: string;
  disabled?: boolean;
  onChange(value: string): void;
}

export function ContentReferenceField(props: ContentReferenceFieldProps) {
  const catalog = useContentReferenceOptions();

  return (
    <UIAutocomplete
      disabled={props.disabled}
      label={props.label}
      loading={catalog.isPending}
      onChange={props.onChange}
      options={catalog.options}
      value={props.value}
    />
  );
}
