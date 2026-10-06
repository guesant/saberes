import { parseContentReference } from "@guesant/saberes-application";
import { useContentReferenceOptions } from "../../components/use-content-reference-options.hook";
import type { PersonalWorkspace, PersonalRelationEndpoint } from "@guesant/saberes-application";

export interface PersonalRelationOption {
  endpoint: PersonalRelationEndpoint;
  label: string;
  value: string;
}

export function usePersonalRelationOptions(workspace: PersonalWorkspace): PersonalRelationOption[] {
  const contentOptions = useContentReferenceOptions();

  const personal = [
    ...workspace.activities.map((item) => {return { endpoint: { id: item.id, recordType: "activity" as const }, label: `Atividade · ${item.title}` };}),
    ...workspace.captures.map((item) => {return { endpoint: { id: item.id, recordType: "capture" as const }, label: `Pendência · ${item.title}` };}),
    ...workspace.checklists.map((item) => {return { endpoint: { id: item.id, recordType: "checklist" as const }, label: `Checklist · ${item.title}` };}),
    ...workspace.notes.map((item) => {return { endpoint: { id: item.id, recordType: "note" as const }, label: `Nota · ${item.title}` };}),
    ...workspace.references.map((item) => {return { endpoint: { id: item.id, recordType: "reference" as const }, label: `Referência · ${item.title}` };}),
  ];

  const editorial = contentOptions.options.flatMap((option) => {
    const reference = parseContentReference(option.value);

    if (!reference || (reference.type !== "question" && reference.type !== "topic")) {
      return [];
    }

    return [{ endpoint: { id: reference.id, recordType: reference.type }, label: option.label }];
  });

  const unique = new Map<string, Omit<PersonalRelationOption, "value">>();

  [...personal, ...editorial].forEach((option) => {
    const value = `${option.endpoint.recordType}:${encodeURIComponent(option.endpoint.id)}`;

    unique.set(value, option);
  });

  return Array.from(unique, ([value, option]) => { return { ...option, value }; });
}
