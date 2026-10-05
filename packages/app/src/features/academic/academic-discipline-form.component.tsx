import { UICard, UICardContent } from "@guesant/saberes-ui";
import { AcademicDisciplineFields } from "./academic-discipline-fields.component";
import { useAcademicDisciplineForm } from "./use-academic-discipline-form.hook";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export interface AcademicDisciplineFormProps {
  initialDiscipline?: AcademicDiscipline;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}

export function AcademicDisciplineForm(props: AcademicDisciplineFormProps) {
  const form = useAcademicDisciplineForm({
    initialDiscipline: props.initialDiscipline,
    onSave: props.onSave,
  });

  return (
    <UICard>
      <UICardContent>
        <AcademicDisciplineFields form={form} />
      </UICardContent>
    </UICard>
  );
}
