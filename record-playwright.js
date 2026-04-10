/**
 * A JavaScript file that allows you to run codegen directly on the plugin, making it easier to generate E2E tests.
 * 
 * Command: node record-playwright.js
 * 
 * Start recording, perform the actions you want to test, then retrieve the generated test and add it to a spec.
 */
import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
    // ici on ne met que le chemin de dev car on ne va utiliser ce script qu'en dev
    const pathToExtension = path.resolve(process.cwd(), 'build/chrome-mv3');

    const context = await chromium.launchPersistentContext('', {
        headless: false,
        args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        ],
    });

    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    
    const extensionId = background.url().split('/')[2];
    const page = await context.newPage();
    
    await page.goto(`chrome-extension://${extensionId}/popup.html#/app/tools`);

    // active codegen
    await page.pause(); 

    context.on('close', () => process.exit());
})();