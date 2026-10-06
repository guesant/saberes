import type { AutocompleteOption } from "./autocomplete-option.interface";

export interface UIAutocompleteProps {
  label: string;
  options: AutocompleteOption[];
  value: string;
  disabled?: boolean;
  loading?: boolean;
  onChange(value: string): void;
}
