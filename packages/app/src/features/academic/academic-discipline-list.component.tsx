import { UIContentGroup } from "@guesant/saberes-ui";
import { AcademicDisciplineItem } from "./academic-discipline-item.component";
import { AcademicEmptyState } from "./academic-empty-state.component";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline, AcademicMetrics } from "@guesant/saberes-application";

export interface AcademicDisciplineListProps {
  disciplines: AcademicDiscipline[];

  metrics: AcademicMetrics[];

  onRemove(id: string): Promise<void>;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}

export function AcademicDisciplineList(props: AcademicDisciplineListProps) {
  if (!props.disciplines.length) {
    return <AcademicEmptyState />;
  }

  return (
    <UIContentGroup variant="list">
      {props.disciplines.map((discipline, index) => {
        return (
          <AcademicDisciplineItem
            discipline={discipline}
            key={discipline.id}
            metrics={props.metrics[index]}
            onRemove={props.onRemove}
            onSave={props.onSave}
          />
        );
      })}
    </UIContentGroup>
  );
}
