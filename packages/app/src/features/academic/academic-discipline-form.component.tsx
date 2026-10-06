import { UIForm, UICard, UICardContent } from "@guesant/saberes-ui";
import { AcademicDisciplineFields } from "./academic-discipline-fields.component";
import { useAcademicDisciplineForm } from "./use-academic-discipline-form.hook";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";
import type { FormEvent } from "react";

export interface AcademicDisciplineFormProps {
  formId: string;

  initialDiscipline?: AcademicDiscipline;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}

export function AcademicDisciplineForm(props: AcademicDisciplineFormProps) {
  const form = useAcademicDisciplineForm({
    initialDiscipline: props.initialDiscipline,
    onSave: props.onSave,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await form.onSave();
  };

  return (
    <UIForm id={props.formId} onSubmit={handleSubmit}>
      <UICard>
        <UICardContent>
          <AcademicDisciplineFields form={form} />
        </UICardContent>
      </UICard>
    </UIForm>
  );
}
