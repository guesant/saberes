import type { AssessmentBlueprintCandidate } from "./models/assessment-blueprint-candidate.interface";
import type { AssessmentBlueprintRule } from "./models/assessment-blueprint-rule.interface";
import type { AssessmentBlueprintSelectionInput } from "./models/assessment-blueprint-selection-input.interface";
import type { AssessmentBlueprintSelection } from "./models/assessment-blueprint-selection.interface";

export function selectAssessmentBlueprintQuestions(
  input: AssessmentBlueprintSelectionInput,
): AssessmentBlueprintSelection {
  const calculateSelectionHash = (value: string): number => {
    const seedScore = input.seed.split("")
      .reduce((result, character) => {
        return (result * 33 + character.charCodeAt(0)) % 2147483647;
      }, 7);

    const valueScore = value.split("")
      .reduce((result, character) => {
        return (result * 31 + character.charCodeAt(0)) % 2147483647;
      }, seedScore);

    return Math.abs(Math.sin(valueScore) * 1000000000);
  };

  const matchesDimensionFilter = (
    values: Array<number | string> | undefined,
    target: number | string | undefined,
  ): boolean => {
    return target === undefined || Boolean(values?.some((value) => {return String(value) === String(target);}));
  };

  const matchesBlueprintRule = (
    candidate: AssessmentBlueprintCandidate,
    rule: AssessmentBlueprintRule,
  ): boolean => {
    return matchesDimensionFilter(candidate.subjectIds, rule.subjectId)
      && matchesDimensionFilter(candidate.topicIds, rule.topicId)
      && matchesDimensionFilter(candidate.skillIds, rule.skillId)
      && (rule.difficulty === undefined || rule.difficulty === "all" || candidate.difficulty === rule.difficulty);
  };

  const variantsByCanonicalId = input.candidates.reduce((variants, candidate) => {
    const canonicalId = String(candidate.canonicalQuestionId);

    const candidates = variants.get(canonicalId) || [];

    variants.set(canonicalId, [...candidates, candidate]);

    return variants;
  }, new Map<string, AssessmentBlueprintCandidate[]>());

  const candidates = [...variantsByCanonicalId.entries()].map(([canonicalQuestionId, variants]) => {return {
    ...variants[0],
    canonicalQuestionId,
  };});

  const orderedRules = [...input.rules].sort((left, right) => {
    return String(left.id)
      .localeCompare(String(right.id));
  });

  const slots = orderedRules.flatMap((rule) => {
    return Array.from({ length: Math.max(0, rule.questionCount) }, (_, index) => {return { rule, index };});
  });

  const eligibleBySlot = slots.map(({ rule }) => {
    return candidates
      .filter((candidate) => {
        return variantsByCanonicalId.get(String(candidate.canonicalQuestionId))!
          .some((variant) => {return matchesBlueprintRule(variant, rule);});
      })
      .sort((left, right) => {
        return calculateSelectionHash(`${input.seed}:${rule.id}:${left.canonicalQuestionId}`)
          - calculateSelectionHash(`${input.seed}:${rule.id}:${right.canonicalQuestionId}`);
      });
  });

  const slotOrder = slots.map((_, index) => {return index;})
    .sort((left, right) => {
      return eligibleBySlot[left].length - eligibleBySlot[right].length || left - right;
    });

  const candidateToSlot = new Map<string, number>();

  const canAssignSlot = (slotIndex: number, visited: Set<string>): boolean => {
    return eligibleBySlot[slotIndex].some((candidate) => {
      const canonicalId = String(candidate.canonicalQuestionId);

      if (visited.has(canonicalId)) {
        return false;
      }

      visited.add(canonicalId);

      const existingSlot = candidateToSlot.get(canonicalId);

      if (existingSlot === undefined || canAssignSlot(existingSlot, visited)) {
        candidateToSlot.set(canonicalId, slotIndex);

        return true;
      }

      return false;
    });
  };

  slotOrder.forEach((slotIndex) => {
    canAssignSlot(slotIndex, new Set());
  });

  const assignments = [...candidateToSlot.entries()]
    .map(([canonicalQuestionId, slotIndex]) => {
      const {rule} = slots[slotIndex];

      const variant = variantsByCanonicalId.get(canonicalQuestionId)!
        .filter((candidate) => {return matchesBlueprintRule(candidate, rule);})
        .sort((left, right) => {
          return calculateSelectionHash(`${input.seed}:${rule.id}:${left.questionKey}`)
            - calculateSelectionHash(`${input.seed}:${rule.id}:${right.questionKey}`);
        })[0];

      return { ruleId: rule.id, questionKey: variant.questionKey, canonicalQuestionId };
    })
    .sort((left, right) => {
      return slots.findIndex((slot) => {return String(slot.rule.id) === String(left.ruleId);})
        - slots.findIndex((slot) => {return String(slot.rule.id) === String(right.ruleId);});
    });

  const insufficiencies = orderedRules.flatMap((rule) => {
    const assigned = assignments.filter((assignment) => {
      return String(assignment.ruleId) === String(rule.id);
    }).length;

    const available = candidates.filter((candidate) => {
      return variantsByCanonicalId.get(String(candidate.canonicalQuestionId))!
        .some((variant) => {return matchesBlueprintRule(variant, rule);});
    }).length;

    return assigned < rule.questionCount
      ? [{ ruleId: rule.id, requested: rule.questionCount, available, missing: rule.questionCount - assigned }]
      : [];
  });

  const requestedCount = orderedRules.reduce((total, rule) => {
    return total + rule.questionCount;
  }, 0);

  const ready = requestedCount === input.expectedQuestionCount
    && assignments.length === input.expectedQuestionCount
    && insufficiencies.length === 0;

  return {
    blueprintId: input.blueprintId,
    blueprintVersion: input.blueprintVersion,
    stageKey: input.stageKey,
    seed: input.seed,
    ready,
    questionKeys: assignments.map((assignment) => {return assignment.questionKey;}),
    assignments,
    insufficiencies,
  };
}
