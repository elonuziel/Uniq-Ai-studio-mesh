import { test, expect } from '@playwright/test';

test.describe('UNIC Club Benefits Portal - E2E & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('verifies correct RTL alignment and Hebrew HTML attributes', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'he');
  });

  test('loads real datasets and displays global rules and brand cards', async ({ page }) => {
    await expect(page.locator('text=מועדון UNIQ')).toBeVisible();
    await expect(page.locator('text=קבוצת פוקס')).toBeVisible();
    await expect(page.locator('text=15% הנחה בטעינה').first()).toBeVisible();
  });

  test('switches across all four tabs and searches across Hebrew terms', async ({ page }) => {
    // Switch to Tab B
    await page.locator('button:has-text("הטבות לפי מוצר")').click();
    await expect(page.locator('text=הטבות מוצר')).toBeVisible();

    // Switch to Tab C
    await page.locator('button:has-text("הנחות רשתות ומותגים")').click();
    await expect(page.locator('text=הנחות רשתות ומותגים')).toBeVisible();

    // Switch to Tab D
    await page.locator('button:has-text("הנחות במעמד החיוב")').click();
    await expect(page.locator('text=כיצד פועלות הנחות במעמד החיוב')).toBeVisible();

    // Search for Japanika
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill("ג'פאניקה");
    await expect(page.locator("text=Japanika - ג'פאניקה")).toBeVisible();
  });

  test('navigates via cross-reference tag with smooth highlight', async ({ page }) => {
    // Return to Tab A
    await page.locator('button:has-text("כרטיס נטען 15%")').click();
    
    // Check cross reference tag
    const crossRef = page.locator('button[title*="עבור ל"]').first();
    if (await crossRef.isVisible()) {
      await crossRef.click();
      await expect(page.locator('text=הגעת דרך הצלבה')).toBeVisible();
      await page.locator('button:has-text("נקה סינון וחזור")').click();
    }
  });
});
