export interface StudyChecklistCreateFieldsProps {
  title: string;
  items: string;
  contentKey: string;
  onTitleChange(value: string): void;

  onItemsChange(value: string): void;

  onContentKeyChange(value: string): void;
}
