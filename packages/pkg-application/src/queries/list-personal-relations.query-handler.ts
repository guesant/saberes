import type { ListPersonalRelationsQueryInput } from "../models/list-personal-relations-query-input.interface";
import type { ListPersonalRelationsPort } from "../ports/list-personal-relations-port.port";
import type { PersonalRelation } from "@guesant/saberes-domain";

export class ListPersonalRelationsQueryHandler {
  public constructor(private readonly port: ListPersonalRelationsPort) {}

  public execute(input: ListPersonalRelationsQueryInput): Promise<PersonalRelation[]> {
    return this.port.execute(input);
  }
}
