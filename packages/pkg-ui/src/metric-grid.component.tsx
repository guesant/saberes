import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridProps = {
    children: ReactNode;
    columns?: 1 | 2;
};

export function UIMetricGrid(props: UIMetricGridProps): ReactElement {
    return (
        <UIBox
            gap="md"
            inset="none"
            layout="grid"
            columns={props.columns ?? 2}
            sx={{ alignItems: "stretch", gridAutoRows: "minmax(96px, auto)" }}
        >
            {props.children}
        </UIBox>
    );
}
