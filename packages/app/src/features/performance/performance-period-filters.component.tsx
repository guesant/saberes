import { UIContentGroup } from "@guesant/saberes-ui";
import { PerformancePeriodButton } from "./performance-period-button.component";
import type { PerformancePeriod } from "./performance-period.type";

export interface PerformancePeriodFiltersProps {
  selected: PerformancePeriod;
  onSelect(period: PerformancePeriod): void;

  label(period: PerformancePeriod): string;
}

export function PerformancePeriodFilters(props: PerformancePeriodFiltersProps) {
  const periods: PerformancePeriod[] = ["all", "7d", "30d"];

  return (
    <UIContentGroup variant="inline">
      {periods.map((period) => {
        return (
          <PerformancePeriodButton
            key={period}
            label={props.label(period)}
            onSelect={props.onSelect}
            period={period}
            selected={props.selected === period}
          />
        );
      })}
    </UIContentGroup>
  );
}
