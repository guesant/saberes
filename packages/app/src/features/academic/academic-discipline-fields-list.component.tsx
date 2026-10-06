import { UIContentGroup } from "@guesant/saberes-ui";
import { AcademicDisciplineTextField } from "./academic-discipline-text-field.component";
import type { AcademicDisciplineFieldsListProps } from "./academic-discipline-fields-list-props.interface";

export function AcademicDisciplineFieldsList(props: AcademicDisciplineFieldsListProps) {
  return (
    <UIContentGroup variant="form">
      {props.fields.map((field) => {
        return (
          <AcademicDisciplineTextField
            inputMin={field.inputMin}
            inputStep={field.inputStep}
            key={field.label}
            label={field.label}
            onChange={field.onChange}
            type={field.type}
            value={field.value}
          />
        );
      })}
    </UIContentGroup>
  );
}
