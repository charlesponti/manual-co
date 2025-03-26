import { expect, type Page } from "@playwright/test";

export async function fillSymptomInput(page: Page, symptom: string) {
	const input = page.locator('[data-testid="symptom-input"]');
	await input.click(); // Ensure input has focus
	await input.fill(symptom);
	// Wait for input value to be updated
	await expect(input).toHaveValue(symptom);
}

export async function clickEnabledButton(page: Page) {
	const submitButton = page.locator('[data-testid="symptom-submit-button"]');

	// Wait for button to be interactive
	await submitButton.waitFor({ state: "attached" });

	// Wait for both the button to be enabled and have the correct text
	await Promise.all([
		expect(submitButton).toBeEnabled(),
		expect(submitButton).toHaveText(/Check/),
	]);

	await submitButton.click();
}
