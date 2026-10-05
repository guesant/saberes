export interface PersonalReferenceCreateFieldsProps {
  title: string;
  source: string;
  contentKey: string;
  onTitleChange(value: string): void;

  onSourceChange(value: string): void;

  onContentKeyChange(value: string): void;
}
