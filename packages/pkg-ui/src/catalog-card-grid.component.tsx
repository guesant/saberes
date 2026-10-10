import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridProps = {
    children: ReactNode;
};

export function UICatalogCardGrid(props: UICatalogCardGridProps): ReactElement {
    return (
        <UIBox
            gap="md"
            inset="none"
            layout="grid"
            columns={1}
            sx={{
                alignItems: "stretch",
                gridAutoRows: "minmax(0, auto)",
            }}
        >
            {props.children}
        </UIBox>
    );
}
