import { UITypography } from "./typography.component";

export interface UICommandPaletteEmptyStateProps {
  label: string;
}

export function UICommandPaletteEmptyState(props: UICommandPaletteEmptyStateProps) {
  return (
    <UITypography color="text.secondary" data-ui-inset="sm" data-ui-layout="stack" sx={{ p: 1 }}>
      {props.label}
    </UITypography>
  );
}
