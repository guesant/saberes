import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";

export type StudyCaptureSaveAction = (content: StudyCaptureContentInput) => Promise<void>;
