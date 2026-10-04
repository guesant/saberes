import {
  array,
  boolean,
  check,
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

const safeEditorialText = pipe(
  string(),
  check((value) => {
    return !/<\s*(?:script|style|iframe|object|embed|form)\b|javascript\s*:/iu.test(value);
  }, "Editorial text contains a forbidden executable or embedded pattern."),
);

const localImageSource = pipe(
  string(),
  minLength(1),
  check((value) => {
    return /^(?:\/|\.\/)[^?#]+\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/iu.test(value);
  }, "Editorial images must use a local published asset."),
);

const controlledVideoUrl = pipe(
  string(),
  check((value) => {
    return (
      /^(?:\/|\.\/)[^?#]+\.(?:mp4|webm|ogg)(?:[?#].*)?$/iu.test(value) ||
      /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|vimeo\.com\/|player\.vimeo\.com\/video\/)[^\s]+$/iu.test(
        value,
      )
    );
  }, "Editorial videos must use a local asset or an approved HTTPS provider."),
);

const chartValue = union([string(), number(), boolean(), array(union([string(), number()]))]);

export const editorialBlocksSchema = array(
  variant("type", [
    object({
      ...baseBlock,
      type: literal("callout"),
      severity: optional(picklist(["info", "success", "warning", "error"])),
      title: optional(safeEditorialText),
      content: safeEditorialText,
    }),
    object({
      ...baseBlock,
      type: literal("formula"),
      formula: string(),
      caption: optional(safeEditorialText),
    }),
    object({
      ...baseBlock,
      type: literal("image"),
      src: localImageSource,
      alt: pipe(string(), minLength(1)),
      caption: optional(safeEditorialText),
    }),
    object({
      ...baseBlock,
      type: literal("video"),
      url: controlledVideoUrl,
      title: optional(safeEditorialText),
    }),
    object({
      ...baseBlock,
      type: literal("question_link"),
      questionId: union([string(), number()]),
      title: optional(safeEditorialText),
      description: optional(safeEditorialText),
    }),
    object({
      ...baseBlock,
      type: literal("summary"),
      title: optional(safeEditorialText),
      content: safeEditorialText,
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
