import { UIBox } from "./box.component";
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
      <UIBox
        accept={props.accept}
        component="input"
        hidden
        layout="flow"
        inset="none"
        onChange={handleChange}
        type="file"
      />
    </UIButton>
  );
}
