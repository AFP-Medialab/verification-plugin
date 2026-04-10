/**
 * This file is a playwright test that verifies that the demo functions as it should. 
 */
import { test, expect } from './fixtures';

test(`Test interactive demo page`, async ({ page, extensionId }) => {

  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/interactive`);
  // Accept local storage usage
  await page.getByText("Accept").click();
  // Click on the "Forensic seach" button that's visible
  await page.locator("[data-testid='interactive-forensic']:visible").click();
  // Checks that we've navigated to the forensic page
  await expect(page.url()).toContain("/app/tools/forensic")
});