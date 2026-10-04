import type { ApplicationServices } from "@guesant/saberes-application";

export type SyncQuestionMasteryInput = {
  services: ApplicationServices;
};

export async function syncQuestionMastery(input: SyncQuestionMasteryInput): Promise<void> {
  const attempts = await input.services.progress.listAttempts.execute();

  const mastery = input.services.study.calculateTopicMastery.execute(attempts);

  await Promise.all(
    Object.entries(mastery)
      .map(([topicId, data]) => {
        return input.services.progress.saveTopicMastery.execute({
          contentKey: `topic:${topicId}`,
          data,
        });
      }),
  );
}
