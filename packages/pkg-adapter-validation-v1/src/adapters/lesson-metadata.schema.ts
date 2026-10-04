import { array, minLength, minValue, number, object, pipe, picklist, string } from "valibot";

export const lessonMetadataSchema = object({
  objective: pipe(string(), minLength(1)),
  audience: pipe(string(), minLength(1)),
  level: picklist(["basic", "intermediate", "advanced", "all"]),
  estimatedMinutes: pipe(number(), minValue(1)),
  prerequisites: array(string()),
  sources: pipe(array(string()), minLength(1)),
  editorialVersion: pipe(string(), minLength(1)),
  reviewStatus: picklist(["draft", "review", "published"]),
});
