import type { CreatePersonalKnowledgeProjectionInput } from "./create-personal-knowledge-projection-input.interface";
import type { PersonalKnowledgeNode } from "../models/personal-knowledge-node.interface";
import type { PersonalKnowledgeProjection } from "../models/personal-knowledge-projection.interface";
import type { PersonalRelationRecordType } from "../models/personal-relation-record-type.type";

const personalRecordTypes: PersonalRelationRecordType[] = [
  "capture",
  "checklist",
  "note",
  "reference",
];

export function createPersonalKnowledgeProjection(
  input: CreatePersonalKnowledgeProjectionInput,
): PersonalKnowledgeProjection {
  const nodes: PersonalKnowledgeNode[] = [];

  const recordTypes = input.lens?.recordTypes ?? personalRecordTypes;

  const shouldIncludeNode = (node: PersonalKnowledgeNode): boolean => {
    return recordTypes.includes(node.recordType) &&
      (!node.archived || (input.lens?.view ?? input.view) === "board");
  };

  input.workspace.notes.forEach((note) => {
    const node: PersonalKnowledgeNode = {
      archived: note.archived,
      id: note.id,
      recordType: "note",
      title: note.title,
    };

    if (shouldIncludeNode(node)) {
      nodes.push(node);
    }
  });

  input.workspace.checklists.forEach((checklist) => {
    const node: PersonalKnowledgeNode = {
      archived: checklist.archived,
      id: checklist.id,
      recordType: "checklist",
      title: checklist.title,
    };

    if (shouldIncludeNode(node)) {
      nodes.push(node);
    }
  });

  input.workspace.captures.forEach((capture) => {
    const node: PersonalKnowledgeNode = {
      archived: capture.archived,
      id: capture.id,
      recordType: "capture",
      title: capture.title,
    };

    if (shouldIncludeNode(node)) {
      nodes.push(node);
    }
  });

  input.workspace.references.forEach((reference) => {
    const node: PersonalKnowledgeNode = {
      archived: reference.archived,
      id: reference.id,
      recordType: "reference",
      title: reference.title,
    };

    if (shouldIncludeNode(node)) {
      nodes.push(node);
    }
  });

  const nodeKeys = new Set(nodes.map((node) => {return `${node.recordType}:${node.id}`;}));

  const relations = (input.workspace.relations ?? []).filter((relation) => {
    if (relation.archived) {
      return false;
    }

    return (
      nodeKeys.has(`${relation.source.recordType}:${relation.source.id}`) ||
      nodeKeys.has(`${relation.target.recordType}:${relation.target.id}`)
    );
  });

  return { nodes, relations };
}
