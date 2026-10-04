import { UIContentGroup } from "@guesant/saberes-ui";
import { getPerformanceScopeLabel } from "./get-performance-scope-label.function";
import { PerformanceScopeButton } from "./performance-scope-button.component";
import type { PerformanceScope } from "./performance-scope.type";

export interface PerformanceScopeFiltersProps {
  selected: PerformanceScope;
  courseLabel?: string;
  planLabel?: string;
  onSelect(scope: PerformanceScope): void;

  label(scope: PerformanceScope, courseLabel?: string, planLabel?: string): string;
}

export function PerformanceScopeFilters(props: PerformanceScopeFiltersProps) {
  const scopes: PerformanceScope[] = ["all"];

  if (props.courseLabel) {
    scopes.push("course");
  }

  if (props.planLabel) {
    scopes.push("plan");
  }

  return (
    <UIContentGroup variant="inline">
      {scopes.map((scope) => {
        return (
          <PerformanceScopeButton
            key={scope}
            label={
              scope === "all"
                ? props.label(scope)
                : getPerformanceScopeLabel(scope, props.courseLabel, props.planLabel)
            }
            onSelect={props.onSelect}
            scope={scope}
            selected={props.selected === scope}
          />
        );
      })}
    </UIContentGroup>
  );
}
