import { expect, it } from "vitest";
import { getTopicMapWithMastery } from "./get-topic-map-with-mastery.function";

it("associa o domínio persistido ao tópico curricular", () => {
  expect(
    getTopicMapWithMastery({
      data: {
        map: { title: "Mapa" },
        nodes: [{ curriculum_topic_id: 7, label: "Funções" }],
        edges: [],
      },
      mastery: [
        {
          contentKey: "topic:7",
          confidence: "medium",
          learningState: "practicing",
          percentage: 75,
        },
      ],
    })?.nodes[0],
  )
    .toMatchObject({
      learning_state: "practicing",
      mastery_confidence: "medium",
      mastery_percentage: 75,
    });
});

it("mantém o mapa e indica estado inicial quando não há evidência", () => {
  expect(
    getTopicMapWithMastery({
      data: { map: {}, nodes: [{ curriculum_topic_id: 9 }], edges: [] },
      mastery: [],
    })?.nodes[0],
  )
    .toMatchObject({
      learning_state: "unseen",
      mastery_confidence: "low",
      mastery_percentage: 0,
    });
});
