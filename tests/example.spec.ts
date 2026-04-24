import { test, expect, type Page } from '@playwright/test';

test.describe('BilarPage Navigation', () => {
  
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Replace with your actual dev URL
    await page.goto('http://localhost:3000'); 
  });

  test('should navigate to specific car slug', async ({ page }: { page: Page }) => {
    // 1. Wait for the vehicle cards to be visible
    const firstCard = page.locator('.vehicle-card').first();
    await expect(firstCard).toBeVisible();

    // 2. Get the slug/href from the link
    const link = firstCard.locator('a');
    const href = await link.getAttribute('href');

    // 3. Click and check navigation
    await link.click();
    
    // Check if the URL matches the expected slug pattern
    if (href) {
      await expect(page).toHaveURL(new RegExp(href));
    }
  });

  test('active filter has yellow border', async ({ page }: { page: Page }) => {
    const touringBtn = page.locator('.body-icon-btn').first();
    await touringBtn.click();

    // Verify the class and CSS
    await expect(touringBtn).toHaveClass(/body-icon-btn--active/);
    await expect(touringBtn).toHaveCSS('border-color', 'rgb(255, 215, 0)'); // #FFD700
  });
});