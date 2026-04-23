/**
 * This file is a playwright test that verifies that the audio's features function as they should. 
 * As it is available only for authenticated users, we use *.authenticated.spec.js so it passes through
 * auth.setup.js that fill localstorage with auth credentials.
 */
import { test, expect } from './fixtures';
import path from 'path';

test(`Test tool analysis audio`, async ({ page, authenticatedExtensionId }) => {
    // mocking upload route 
    await page.route('**/vera/loccus/upload', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                "id": "019dbb37-f72e-7c43-a471-e1636b89d90f",
                "handle": "a471-e1636b89d90f",
                "alias": "d4361a48-a8f3-4e9a-8252-92193d83e496",
                "state": "available",
                "duration": "PT7.584S",
                "sampleRate": 1000,
                "createdAt": "2026-04-23T16:41:40.398837Z",
                "uploadedAt": "2026-04-23T16:41:40.622373Z"
            }),
        });
    });

    // mocking detection
    await page.route('**/vera/loccus/detection', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                "id": "019dbb37-f95d-75d0-b039-8fe6b8dab700",
                "handle": "b039-8fe6b8dab700",
                "state": "performed",
                "scores": { "synthesis": 0.01 },
                "chunks": [
                    {
                        "startTime": "PT0S",
                        "endTime": "PT4S",
                        "label": "validVoice",
                        "scores": { "synthesis": 0.01 }
                    },
                    {
                        "startTime": "PT4S",
                        "endTime": "PT7.584S",
                        "label": "validVoice",
                        "scores": { "synthesis": 0.02 }
                    }
                ],
                "performedAt": "2026-04-23T16:41:42.058575Z"
            }),
        });
    });

    // mocking the chunks
    await page.route(/\/vera\/loccus\/detection\/.*\/chunks/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    "startTime": "PT0S",
                    "endTime": "PT4S",
                    "label": "validVoice",
                    "duration": "PT4S",
                    "voiceDuration": "PT3.968S",
                    "scores": { "synthesis": 0.01 }
                },
                {
                    "startTime": "PT4S",
                    "endTime": "PT7.584S",
                    "label": "validVoice",
                    "duration": "PT3.584S",
                    "voiceDuration": "PT3.296S",
                    "scores": { "synthesis": 0.02 }
                }
            ]),
        });
    });

    await page.goto(`chrome-extension://${authenticatedExtensionId}/popup.html#/app/tools/hiya`);

    const filePath = path.resolve(__dirname, '../../tests-assets/test-hiya.mp3');
    
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.getByTestId('hiya-submit').click();

    await expect (page.getByTestId("hiya-results")).toBeVisible();
    await expect (page.getByTestId("hiya-results-leftpanel")).toBeVisible();
    await expect (page.getByTestId("hiya-results-rightpanel")).toBeVisible();

    await page.getByTestId('hiya-close').click();
    await expect (page.getByTestId("hiya-results")).toHaveCount(0);
});