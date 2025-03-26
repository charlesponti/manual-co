import { expect, type Page } from "@playwright/test";

export async function clickEnabledButton(page: Page) {
	const submitButton = page.locator('button[type="submit"]');
	await expect(submitButton).toHaveText(/Check/);
	await expect(submitButton).toBeEnabled({ timeout: 700 });
	await submitButton.click();
}
