export interface StudyCaptureActionsProps {
  contentPath: string | null;
  reviewPath: string | null;
  onUpdateCompletion(): Promise<void>;

  onArchive(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}
