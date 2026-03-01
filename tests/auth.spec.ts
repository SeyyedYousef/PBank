import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/PBank/);
});

test('login flow', async ({ page }) => {
    await page.goto('/onboarding');

    // 1. Intro Step
    await page.getByRole('button', { name: 'شروع کنید' }).click();

    // 2. Phone Step
    await page.getByPlaceholder('09123456789').fill('09123456789');
    await page.getByRole('button', { name: 'ادامه' }).click();

    // 3. OTP Step (Wait for mock fill or manual fill)
    // Our prototype auto-fills '88888' after 1s.
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'ورود به حساب' }).click();

    // 4. Verify Home Page
    await expect(page).toHaveURL('/');

    // Check for balance (localized or not)
    // We can look for the balance element or user name
    await expect(page.getByText('موجودی کل').or(page.getByText('Total Balance'))).toBeVisible();
});
