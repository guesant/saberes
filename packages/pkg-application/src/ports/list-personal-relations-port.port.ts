import type { ListPersonalRelationsQueryInput } from "../models/list-personal-relations-query-input.interface";
import type { PersonalRelation } from "@guesant/saberes-domain";

export interface ListPersonalRelationsPort {
  execute(input: ListPersonalRelationsQueryInput): Promise<PersonalRelation[]>;
}
