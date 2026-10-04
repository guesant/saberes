import type { PersonalWorkspace } from "@guesant/saberes-application";

export type PersonalWorkspaceSaver = (workspace: PersonalWorkspace) => Promise<void>;
