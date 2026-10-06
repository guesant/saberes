import type { ClassifyStudyCaptureInput } from "./classify-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/index";

export function classifyStudyCapture(input: ClassifyStudyCaptureInput): PersonalWorkspace {
  const capture = input.workspace.captures.find((item) => {
    return item.id === input.captureId;
  });

  if (!capture) {
    throw new Error(`Study capture not found: ${input.captureId}`);
  }

  const existingNote = input.workspace.notes.find((item) => {
    return item.sourceCaptureId === input.captureId;
  });

  const existingActivity = input.workspace.activities.find((item) => {
    return item.sourceCaptureId === input.captureId;
  });

  if (existingNote || existingActivity) {
    const existingTargetType = existingNote ? "note" : "activity";

    if (existingTargetType !== input.targetType) {
      throw new Error(`Study capture already classified: ${input.captureId}`);
    }

    return input.workspace;
  }

  const classifiedCapture = {
    ...capture,
    archived: true,
    updatedAt: input.now,
  };

  const captures = input.workspace.captures.map((item) => {
    return item.id === input.captureId ? classifiedCapture : item;
  });

  if (input.targetType === "note") {
    return {
      ...input.workspace,
      captures,
      notes: [
        ...input.workspace.notes,
        {
          id: input.targetId,
          sourceCaptureId: input.captureId,
          title: capture.title,
          body: capture.description,
          contentReference: capture.contentReference,
          archived: false,
          createdAt: input.now,
          updatedAt: input.now,
        },
      ],
    };
  }

  return {
    ...input.workspace,
    activities: [
      ...input.workspace.activities,
      {
        id: input.targetId,
        sourceCaptureId: input.captureId,
        title: capture.title,
        description: capture.description,
        contentReference: capture.contentReference,
        status: "planned",
        dueDate: capture.dueDate,
        createdAt: input.now,
        updatedAt: input.now,
      },
    ],
    captures,
  };
}
