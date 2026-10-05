import type { PersonalWorkspace } from "@guesant/saberes-application";

export type PersonalWorkspaceSaveAction = (workspace: PersonalWorkspace) => Promise<void>;
