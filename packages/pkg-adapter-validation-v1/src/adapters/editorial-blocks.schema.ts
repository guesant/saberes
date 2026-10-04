import {
  array,
  boolean,
  literal,
  minLength,
  number,
  object,
  optional,
  picklist,
  pipe,
  record,
  string,
  union,
  variant,
} from "valibot";

const baseBlock = { type: string() };

const chartValue = union([string(), number(), boolean(), array(union([string(), number()]))]);

export const editorialBlocksSchema = array(
  variant("type", [
    object({
      ...baseBlock,
      type: literal("callout"),
      severity: optional(picklist(["info", "success", "warning", "error"])),
      title: optional(string()),
      content: string(),
    }),
    object({
      ...baseBlock,
      type: literal("formula"),
      formula: string(),
      caption: optional(string()),
    }),
    object({
      ...baseBlock,
      type: literal("image"),
      src: string(),
      alt: pipe(string(), minLength(1)),
      caption: optional(string()),
    }),
    object({
      ...baseBlock,
      type: literal("video"),
      url: string(),
      title: optional(string()),
    }),
    object({
      ...baseBlock,
      type: literal("question_link"),
      questionId: union([string(), number()]),
      title: optional(string()),
      description: optional(string()),
    }),
    object({
      ...baseBlock,
      type: literal("summary"),
      title: optional(string()),
      content: string(),
    }),
    object({
      ...baseBlock,
      type: literal("comparison_table"),
      headers: array(string()),
      rows: array(array(string())),
    }),
    object({
      ...baseBlock,
      type: literal("chart"),
      title: optional(string()),
      option: record(string(), chartValue),
    }),
    object({
      ...baseBlock,
      type: literal("knowledge_map"),
      title: optional(string()),
      nodes: array(
        object({
          id: string(),
          label: string(),
          status: optional(picklist(["locked", "available", "completed"])),
        }),
      ),
      edges: array(
        object({
          source: string(),
          target: string(),
          relation: optional(string()),
        }),
      ),
    }),
    object({
      ...baseBlock,
      type: literal("parametric_scene"),
      title: optional(string()),
      shape: picklist(["cube", "sphere", "torus"]),
      color: optional(string()),
      scale: optional(number()),
      rotationSpeed: optional(number()),
    }),
  ]),
);
