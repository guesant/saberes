export interface PersonalNoteEditingState {
  editing: boolean;

  title: string;

  body: string;

  contentKey: string;

  setEditing(value: boolean): void;

  setTitle(value: string): void;

  setBody(value: string): void;

  setContentKey(value: string): void;
}
