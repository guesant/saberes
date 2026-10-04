export type UIFileInputProps = {
  accept?: string;
  disabled?: boolean;
  label: string;
  onFile(file: File): void;
};
