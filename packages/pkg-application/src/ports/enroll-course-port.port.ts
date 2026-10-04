import type { EnrollCourseInput, StudyRecord } from "../models/index";

export interface EnrollCoursePort {
  execute(input: EnrollCourseInput): Promise<StudyRecord>;
}
