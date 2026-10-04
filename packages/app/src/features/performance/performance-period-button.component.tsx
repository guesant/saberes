import { UIButton } from "@guesant/saberes-ui";
import type { PerformancePeriod } from "./performance-period.type";

export interface PerformancePeriodButtonProps {
  period: PerformancePeriod;
  selected: boolean;
  label: string;
  onSelect(period: PerformancePeriod): void;
}

export function PerformancePeriodButton(props: PerformancePeriodButtonProps) {
  return (
    <UIButton
      aria-pressed={props.selected}
      onClick={() => {
        return props.onSelect(props.period);
      }}
      size="small"
      variant={props.selected ? "contained" : "outlined"}
    >
      {props.label}
    </UIButton>
  );
}
