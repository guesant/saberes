import type { StudyCaptureCreateInput } from "./study-capture-create-input.interface";

export type StudyCaptureCreateHandler = (input: StudyCaptureCreateInput) => Promise<void>;
