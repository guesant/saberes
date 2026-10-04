export type UIDownloadFileButtonProps = {
  disabled?: boolean;
  fileName: string;
  label: string;
  onDownload: () => Promise<string>;
  onError: (error: Error) => void;
};
