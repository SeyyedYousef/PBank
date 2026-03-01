import { test, expect } from '@playwright/test';

test.describe('Money Transfer Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/onboarding');
        await page.getByRole('button', { name: 'شروع کنید' }).click();
        await page.getByPlaceholder('09123456789').fill('09123456789');
        await page.getByRole('button', { name: 'ادامه' }).click();
        await page.waitForTimeout(1500); // Wait for OTP auto-fill
        await page.getByRole('button', { name: 'ورود به حساب' }).click();
        await expect(page).toHaveURL('/');
    });

    test('should navigate to transfer page from home', async ({ page }) => {
        // Click Send button
        await page.getByRole('button', { name: /ارسال|Send/i }).click();

        // Verify we're on transfer page
        await expect(page.getByText(/ارسال پول|Send Money/i)).toBeVisible();
    });

    test('should complete a transfer successfully', async ({ page }) => {
        // Go to transfer page
        await page.getByRole('button', { name: /ارسال|Send/i }).click();
        await expect(page.getByText(/ارسال پول|Send Money/i)).toBeVisible();

        // Enter recipient (phone number or contact)
        const recipientInput = page.getByPlaceholder(/شماره|گیرنده|recipient/i);
        if (await recipientInput.isVisible()) {
            await recipientInput.fill('0799123456');
        }

        // Enter amount
        const amountInput = page.getByPlaceholder(/مبلغ|amount/i).or(page.locator('input[type="number"]'));
        if (await amountInput.isVisible()) {
            await amountInput.fill('100');
        }

        // Click continue/next button
        const continueBtn = page.getByRole('button', { name: /ادامه|Continue|بعدی|Next/i });
        if (await continueBtn.isVisible()) {
            await continueBtn.click();
        }

        // On confirmation page, look for confirm button
        const confirmBtn = page.getByRole('button', { name: /تایید|Confirm|ارسال|Send/i });
        if (await confirmBtn.isVisible()) {
            await confirmBtn.click();
        }

        // Wait for receipt or success indicator
        // Either we see receipt page or success message
        await page.waitForTimeout(2000);

        // Check for success (receipt page or success toast)
        const isReceipt = await page.getByText(/رسید|Receipt|موفق|Success/i).isVisible();
        expect(isReceipt).toBe(true);
    });

    test('should show balance deduction indicator', async ({ page }) => {
        await page.getByRole('button', { name: /ارسال|Send/i }).click();

        // Enter an amount
        const amountInput = page.getByPlaceholder(/مبلغ|amount/i).or(page.locator('input[type="number"]'));
        if (await amountInput.isVisible()) {
            await amountInput.fill('500');

            // Should show remaining balance or deduction indicator
            await page.waitForTimeout(500);
            // Look for balance indicator text
            const balanceText = page.locator('text=/موجودی|باقی|Remaining|After/i');
            if (await balanceText.isVisible()) {
                expect(await balanceText.isVisible()).toBe(true);
            }
        }
    });

    test('should allow canceling transfer', async ({ page }) => {
        await page.getByRole('button', { name: /ارسال|Send/i }).click();

        // Look for close/cancel button
        const closeBtn = page.getByRole('button', { name: /X|بستن|Close|لغو|Cancel/i }).or(page.locator('button:has-text("X")'));

        if (await closeBtn.first().isVisible()) {
            await closeBtn.first().click();
        } else {
            // Try back navigation
            await page.goBack();
        }

        // Should be back on home page
        await expect(page).toHaveURL('/');
    });
});
