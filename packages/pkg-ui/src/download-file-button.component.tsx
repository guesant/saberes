import { UIButton } from "./button.component";
import type { UIDownloadFileButtonProps } from "./download-file-button-props.type";
import type { ReactElement } from "react";

export function UIDownloadFileButton(props: UIDownloadFileButtonProps): ReactElement {
  const handleClick = async (): Promise<void> => {
    try {
      const content = await props.onDownload();

      const blob = new Blob([content], { type: "application/json" });

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;

      anchor.download = props.fileName;

      anchor.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      props.onError(error instanceof Error ? error : new Error("Falha ao exportar o arquivo."));
    }
  };

  return (
    <UIButton disabled={props.disabled} onClick={handleClick} variant="outlined">
      {props.label}
    </UIButton>
  );
}
