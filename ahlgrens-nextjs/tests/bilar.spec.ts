import { test, expect } from '@playwright/test';

test.describe('Bilar Page Filtering', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/bilar');
    // Wait for vehicle cards to mount before each test
    await page.waitForSelector('.vehicle-card', { timeout: 10000 });
  });

  // ── Default state ───────────────────────────────────────────

  test('should load with Alla (All) filter active by default', async ({ page }) => {
    // Default condition is 'all' — "Alla" button should be active
    const allaBtn = page.getByRole('button', { name: 'Alla', exact: true }).first();
    await expect(allaBtn).toHaveClass(/status-btn--active/);
  });

  test('should show vehicle cards on load', async ({ page }) => {
    const cards = page.locator('.vehicle-card');
    await expect(cards.first()).toBeVisible();
    // Sanity check: at least one card rendered
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show Husbilar body type icons by default', async ({ page }) => {
    // activeType defaults to 'Camper' — icons should be visible without clicking
    const halvBtn = page.getByRole('button', { name: 'HALVINTEGRERAD', exact: true });
    await expect(halvBtn).toBeVisible();
    const integBtn = page.getByRole('button', { name: 'INTEGRERAD', exact: true });
    await expect(integBtn).toBeVisible();
    const alkovBtn = page.getByRole('button', { name: 'ALKOV', exact: true });
    await expect(alkovBtn).toBeVisible();
  });

  // ── Vehicle type tabs ───────────────────────────────────────

  test('should switch body icons when Husvagnar tab is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Husvagnar' }).click();

    // Caravan icons should appear
    await expect(page.getByRole('button', { name: 'ENKELAXLAD', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DUBBELAXLAD', exact: true })).toBeVisible();

    // Camper icons should be gone
    await expect(page.getByRole('button', { name: 'HALVINTEGRERAD', exact: true })).not.toBeVisible();
  });

  test('should switch body icons when MC tab is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'MC' }).click();
    await expect(page.getByRole('button', { name: 'TOURING', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SPORT', exact: true })).toBeVisible();
  });

  // ── Body type icon cards ────────────────────────────────────

  test('should activate body icon on click and dim others', async ({ page }) => {
    const halvBtn = page.getByRole('button', { name: 'HALVINTEGRERAD', exact: true });
    await halvBtn.click();

    // Clicked icon gets active class
    await expect(halvBtn).toHaveClass(/body-icon-btn--active/);

    // Other icons get dim class
    const integBtn = page.getByRole('button', { name: 'INTEGRERAD', exact: true });
    await expect(integBtn).toHaveClass(/body-icon-btn--dim/);
  });

  test('should deselect body icon on second click', async ({ page }) => {
    const halvBtn = page.getByRole('button', { name: 'HALVINTEGRERAD', exact: true });
    await halvBtn.click();
    await expect(halvBtn).toHaveClass(/body-icon-btn--active/);

    // Click again to deselect
    await halvBtn.click();
    await expect(halvBtn).not.toHaveClass(/body-icon-btn--active/);
  });

  // ── Condition filter ────────────────────────────────────────

  test('should filter to new vehicles when Nya is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Nya', exact: true }).click();

    const nyaBtn = page.getByRole('button', { name: 'Nya', exact: true });
    await expect(nyaBtn).toHaveClass(/status-btn--active/);

    // Badges should only show NYHET
    const badges = page.locator('.vehicle-card__badge');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText('NYHET');
    }
  });

  test('should filter to used vehicles when Begagnade is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Begagnade', exact: true }).click();

    const begBtn = page.getByRole('button', { name: 'Begagnade', exact: true });
    await expect(begBtn).toHaveClass(/status-btn--active/);

    // Badges should only show BEGAGNAD (not NYHET)
    const badges = page.locator('.vehicle-card__badge');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).textContent();
      expect(text).not.toBe('NYHET');
    }
  });

  // ── Search ──────────────────────────────────────────────────

  test('should filter results based on search input', async ({ page }) => {
    // First switch to Alla so all vehicle types are visible
    await page.getByRole('button', { name: 'Alla', exact: true }).first().click();

    const searchInput = page.getByPlaceholder('Sök märke eller modell...');
    await searchInput.fill('Adria');

    // Wait for grid to update
    await page.waitForTimeout(300);

    const resultsCount = page.locator('.results-count');
    await expect(resultsCount).toContainText(/fordon/);

    // All visible card titles should contain Adria
    const titles = page.locator('.vehicle-card__title');
    const count = await titles.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(titles.nth(i)).toContainText(/Adria/i);
    }
  });

  test('should clear search and restore results when input cleared', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Sök märke eller modell...');
    await searchInput.fill('Adria');
    await page.waitForTimeout(300);

    const countAfterSearch = await page.locator('.vehicle-card').count();

    await searchInput.clear();
    await page.waitForTimeout(300);

    const countAfterClear = await page.locator('.vehicle-card').count();
    expect(countAfterClear).toBeGreaterThan(countAfterSearch);
  });

  // ── View mode ───────────────────────────────────────────────

  test('should switch between grid and list view', async ({ page }) => {
    const listBtn = page.getByLabel('Listvy');
    const gridBtn = page.getByLabel('Rutnätsvy');

    // Switch to list
    await listBtn.click();
    await expect(listBtn).toHaveClass(/view-btn--active/);
    await expect(page.locator('.vgrid--list')).toBeVisible();

    // Switch back to grid
    await gridBtn.click();
    await expect(gridBtn).toHaveClass(/view-btn--active/);
    await expect(page.locator('.vgrid--list')).not.toBeVisible();
  });

  // ── Extended filters ────────────────────────────────────────

  test('should show filter grid when Visa fler filter is clicked', async ({ page }) => {
    // Grid is hidden by default
    await expect(page.locator('.filter-grid-primary')).not.toBeVisible();

    await page.getByRole('button', { name: /Visa fler filter/i }).click();
    await expect(page.locator('.filter-grid-primary')).toBeVisible();
  });

  test('should hide filter grid when Dölj filter is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Visa fler filter/i }).click();
    await expect(page.locator('.filter-grid-primary')).toBeVisible();

    await page.getByRole('button', { name: /Dölj filter/i }).click();
    await expect(page.locator('.filter-grid-primary')).not.toBeVisible();
  });

  // ── Nollställ filter ────────────────────────────────────────

  test('Nollställ filter button should be disabled by default', async ({ page }) => {
    const resetBtn = page.getByRole('button', { name: /Nollställ filter/i });
    await expect(resetBtn).toBeDisabled();
  });

  test('Nollställ filter should clear active filters', async ({ page }) => {
    // Activate a filter
    await page.getByRole('button', { name: 'Begagnade', exact: true }).click();
    const resetBtn = page.getByRole('button', { name: /Nollställ filter/i });
    await expect(resetBtn).toBeEnabled();

    // Reset
    await resetBtn.click();

    // Alla should be active again
    const allaBtn = page.getByRole('button', { name: 'Alla', exact: true }).first();
    await expect(allaBtn).toHaveClass(/status-btn--active/);
    await expect(resetBtn).toBeDisabled();
  });

});