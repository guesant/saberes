import { UITypography } from "./typography.component";

export interface UICommandPaletteEmptyStateProps {
  label: string;
}

export function UICommandPaletteEmptyState(props: UICommandPaletteEmptyStateProps) {
  return (
    <UITypography color="text.secondary" sx={{ px: 2, py: 1 }}>
      {props.label}
    </UITypography>
  );
}
