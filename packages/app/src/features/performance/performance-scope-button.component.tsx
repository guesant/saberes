import { UIButton } from "@guesant/saberes-ui";
import type { PerformanceScope } from "./performance-scope.type";

export interface PerformanceScopeButtonProps {
  scope: PerformanceScope;
  selected: boolean;
  label: string;
  onSelect(scope: PerformanceScope): void;
}

export function PerformanceScopeButton(props: PerformanceScopeButtonProps) {
  return (
    <UIButton
      aria-pressed={props.selected}
      onClick={() => {
        return props.onSelect(props.scope);
      }}
      size="small"
      variant={props.selected ? "contained" : "outlined"}
    >
      {props.label}
    </UIButton>
  );
}
