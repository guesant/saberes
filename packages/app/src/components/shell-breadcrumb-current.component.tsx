import { UITypography } from "@guesant/saberes-ui";

export interface ShellBreadcrumbCurrentProps {
  label: string;
}

export function ShellBreadcrumbCurrent(props: ShellBreadcrumbCurrentProps) {
  return (
    <UITypography aria-current="page" color="text.primary" variant="body2">
      {props.label}
    </UITypography>
  );
}
