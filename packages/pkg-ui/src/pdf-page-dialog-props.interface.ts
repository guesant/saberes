export interface UIPdfPageDialogProps {
  open: boolean;
  onClose(): void;
  page: number;
  src: string;
  title: string;
}
