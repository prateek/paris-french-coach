const { test, expect } = require("@playwright/test");

const baseURL = process.env.PROTOTYPE_URL || "http://127.0.0.1:4173/";

test.use({ viewport: { width: 390, height: 844 } });

test("learner mission loop is clickable end to end", async ({ page }) => {
  await page.goto(baseURL);

  await expect(page.getByRole("heading", { name: /Practical French/ })).toBeVisible();
  await page.getByRole("button", { name: /Set my goal/ }).click();
  await expect(page.getByRole("heading", { name: /B1 practical confidence/ })).toBeVisible();

  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("heading", { name: /A2\+/ })).toBeVisible();

  await page.getByRole("button", { name: /Start today/ }).click();
  await expect(page.getByRole("heading", { name: "Today's Paris mission" })).toBeVisible();

  await page.getByRole("button", { name: /Start mission/ }).click();
  await expect(page.getByRole("heading", { name: /Report a problem/ })).toBeVisible();

  await page.getByRole("button", { name: /Listen first/ }).click();
  await expect(page.getByRole("heading", { name: /real phone call pace/ })).toBeVisible();

  await page.getByRole("button", { name: "Transcript" }).click();
  await expect(page.locator("#transcript").getByText("Le chauffage ne fonctionne plus depuis hier.")).toBeVisible();

  await page.getByRole("button", { name: /Learn the phrases/ }).click();
  await expect(page.locator("#phrase-coach").getByText("Je voulais savoir s'il serait possible de...")).toBeVisible();

  await page.getByRole("button", { name: /Try the call/ }).click();
  await expect(page.getByRole("heading", { name: /Call the property contact/ })).toBeVisible();

  await page.getByRole("button", { name: /Start recording/ }).click();
  await expect(page.getByText("Recording", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Get feedback/ }).click();

  await expect(page.getByRole("heading", { name: /Clear, polite/ })).toBeVisible();
  await expect(page.locator("#speaking-feedback").getByText("Encouraging summary")).toBeVisible();
  await page.getByRole("button", { name: /Save to review/ }).click();
  await expect(page.getByRole("button", { name: /Saved to review/ })).toBeVisible();

  await page.getByRole("button", { name: /Complete mission/ }).click();
  await expect(page.getByRole("heading", { name: /Apartment heating call saved/ })).toBeVisible();
});

test("tabs, review, roleplay, and coach dashboard states work", async ({ page }) => {
  await page.goto(`${baseURL}?screen=today-home`);

  await page.locator(".tab-bar").getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Mistakes worth keeping/ })).toBeVisible();

  await page.getByLabel("Start review").click();
  await expect(page.getByRole("heading", { name: /Make this more natural/ })).toBeVisible();
  await page.getByRole("button", { name: /Reveal answer/ }).click();
  await expect(page.getByText("Est-ce que quelqu'un pourrait passer pour regarder le chauffage ?")).toBeVisible();

  await page.locator(".tab-bar").getByRole("button", { name: "Speak", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Roleplays for Paris life/ })).toBeVisible();

  await page.getByLabel("Open roleplay").click();
  await expect(page.getByRole("heading", { name: /Heating follow-up/ })).toBeVisible();
  await page.getByRole("button", { name: "depuis hier" }).click();
  await expect(page.locator("#roleplay-chat").getByText("Le chauffage ne fonctionne plus depuis hier.")).toBeVisible();

  await page.goto(`${baseURL}?mode=coach`);
  await expect(page.getByRole("heading", { name: /Anika - Paris readiness plan/ })).toBeVisible();

  await page.locator(".coach-tabs").getByRole("button", { name: "Mission planner", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Next five practical missions/ })).toBeVisible();

  await page.locator(".coach-tabs").getByRole("button", { name: "Attempt review", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Heating call - latest attempt/ })).toBeVisible();

  await page.locator(".coach-tabs").getByRole("button", { name: "Mistake bank", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Review items by pattern/ })).toBeVisible();

  await page.locator(".coach-tabs").getByRole("button", { name: "Content editor", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Heating repair mission/ })).toBeVisible();
});
