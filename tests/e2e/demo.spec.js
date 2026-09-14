/**
 * This file is a playwright test that verifies that the demo functions as it should.
 */
// import { test, expect } from './fixtures';

// const INTERACTIVE_URL = (extensionId) =>
//   `chrome-extension://${extensionId}/popup.html#/app/interactive`;

// test('Interactive: forensic button navigates to forensic tool', async ({ page, extensionId }) => {
//   await page.goto(INTERACTIVE_URL(extensionId));
//   await page.getByText('Accept').click();

//   await page.locator("[data-testid='interactive-forensic']:visible").click();

//   await expect(page).toHaveURL(/\/app\/tools\/forensic/);
// });

// test('Interactive: keyframes button navigates to keyframes tool', async ({ page, extensionId }) => {
//   await page.goto(INTERACTIVE_URL(extensionId));
//   await page.getByText('Accept').click();

//   // Navigate to the first video item (item 6, index 5)
//   for (let i = 0; i < 5; i++) {
//     await page.locator("[data-testid='interactive-next']:visible").click();
//   }

//   await page.locator("[data-testid='interactive-keyframes']:visible").click();

//   await expect(page).toHaveURL(/\/app\/tools\/keyframes/);
// });
