import { UIButton } from "./button.component";
import type { UIFileInputProps } from "./file-input-props.type";
import type { ChangeEvent, ReactElement } from "react";

export function UIFileInput(props: UIFileInputProps): ReactElement {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (file) {
      props.onFile(file);
    }
  };

  return (
    <UIButton component="label" disabled={props.disabled} variant="outlined">
      {props.label}
      <input accept={props.accept} hidden onChange={handleChange} type="file" />
    </UIButton>
  );
}
