import { expect, test } from "@playwright/test";

const prohibitedPersonalTerms = [
  "chat",
  "grupo",
  "grupos",
  "convite",
  "convites",
  "participante",
  "participantes",
  "rsvp",
  "membro",
  "membros",
];

test("M3-UI-004 representa o espaço como experiência pessoal", async ({ page }) => {
  await page.goto("/meu-espaco", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Meu espaço" }))
    .toBeVisible();

  await expect(page.getByRole("heading", { name: "Adicionar ao seu espaço" }))
    .toBeVisible();

  await expect(page.getByRole("heading", { name: "Seu espaço está pronto para receber algo." }))
    .toBeVisible();

  await expect(page.getByText("Crie uma nota, checklist, pendência ou referência para começar.", { exact: true }))
    .toBeVisible();

  const mainText = (await page.locator("#main-content")
    .innerText())
    .toLocaleLowerCase();

  prohibitedPersonalTerms.forEach((term) => {
    expect(mainText)
      .not
      .toContain(term);
  });
});
