import {
    array,
    literal,
    minLength,
    minValue,
    number,
    object,
    optional,
    picklist,
    pipe,
    record,
    safeParse,
    string,
    union,
    unknown,
    variant,
    type InferOutput,
} from "valibot";
import { PedagogicalRole } from "@guesant/saberes-domain";

export const pedagogicalRoles = Object.values(PedagogicalRole);

const base = { type: string() };

const blockSchema = variant("type", [
    object({
        ...base,
        type: literal("callout"),
        severity: optional(picklist(["info", "success", "warning", "error"])),
        title: optional(string()),
        content: string(),
    }),
    object({
        ...base,
        type: literal("formula"),
        formula: string(),
        caption: optional(string()),
    }),
    object({
        ...base,
        type: literal("image"),
        src: string(),
        alt: string(),
        caption: optional(string()),
    }),
    object({
        ...base,
        type: literal("video"),
        url: string(),
        title: optional(string()),
    }),
    object({
        ...base,
        type: literal("question_link"),
        questionId: union([string(), number()]),
        title: optional(string()),
        description: optional(string()),
    }),
    object({
        ...base,
        type: literal("summary"),
        title: optional(string()),
        content: string(),
    }),
    object({
        ...base,
        type: literal("comparison_table"),
        headers: array(string()),
        rows: array(array(string())),
    }),
    object({
        ...base,
        type: literal("chart"),
        title: optional(string()),
        option: record(string(), unknown()),
    }),
    object({
        ...base,
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
        ...base,
        type: literal("parametric_scene"),
        title: optional(string()),
        shape: picklist(["cube", "sphere", "torus"]),
        color: optional(string()),
        scale: optional(number()),
        rotationSpeed: optional(number()),
    }),
]);

export type EditorialBlock = InferOutput<typeof blockSchema>;

export function parseEditorialBlocks(value: string | unknown): EditorialBlock[] {
    let candidate = value;
    if (typeof value === "string") {
        try {
            candidate = JSON.parse(value);
        } catch {
            return [];
        }
    }
    const result = safeParse(array(unknown()), candidate);
    if (!result.success) return [];
    return result.output.flatMap((block) => {
        const parsed = safeParse(blockSchema, block);
        return parsed.success ? [parsed.output] : [];
    });
}

export const lessonMetadataSchema = object({
    objective: pipe(string(), minLength(1)),
    audience: pipe(string(), minLength(1)),
    level: picklist(["basic", "intermediate", "advanced", "all"]),
    estimatedMinutes: pipe(number(), minValue(1)),
    prerequisites: array(string()),
    sources: array(string()),
    editorialVersion: pipe(string(), minLength(1)),
    reviewStatus: picklist(["draft", "review", "published"]),
});

export function validatePedagogicalRoles(roles: string[]) {
    const missing = pedagogicalRoles.filter((role) => !roles.includes(role));
    return { valid: missing.length === 0, missing };
}
