import { UIBox } from "./box.component";
import type { UIBoxProps } from "./layout/ui-box-props.type";
import type { ReactElement } from "react";

export type UITableProps = UIBoxProps<"table">;

export function UITable(props: UITableProps): ReactElement {
  return <UIBox {...props} component="table" layout="native" />;
}
