import { expect, type Page } from "@playwright/test";

export async function clickEnabledButton(page: Page) {
	const submitButton = page.locator('[data-testid="symptom-submit-button"]');

	// Wait for both the button to be enabled and have the correct text
	await Promise.all([
		expect(submitButton).toBeEnabled(),
		expect(submitButton).toHaveText(/Check/),
	]);

	await submitButton.click();
}
