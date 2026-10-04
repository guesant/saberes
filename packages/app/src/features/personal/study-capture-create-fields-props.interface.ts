export interface StudyCaptureCreateFieldsProps {
  title: string;
  description: string;
  contentKey: string;
  dueDate: string;

  onTitleChange(value: string): void;

  onDescriptionChange(value: string): void;

  onContentKeyChange(value: string): void;

  onDueDateChange(value: string): void;

  onCreate(): Promise<void>;
}
