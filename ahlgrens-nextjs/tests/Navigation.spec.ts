import { test, expect } from '@playwright/test';

// Tests run against any page that mounts Navigation.
// Using homepage as the base since nav is always present.
const BASE = 'http://localhost:3000';

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    // Wait for nav to be present
    await page.waitForSelector('.site-nav', { timeout: 10000 });
  });

  // ── Brand ─────────────────────────────────────────────────────

  test('brand link renders and navigates to home', async ({ page }) => {
    const brand = page.locator('.nav-brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('AHLGRENS');
    await brand.click();
    await expect(page).toHaveURL(BASE + '/');
  });

  // ── Nav links ─────────────────────────────────────────────────

  test('all nav links are visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('link', { name: 'HEM',          exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /VÅRA BILAR/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'MÄRKEN',       exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'OM OSS',       exact: true })).toBeVisible();
  });

  test('HEM link is active when on homepage', async ({ page }) => {
    const hemLink = page.getByRole('link', { name: 'HEM', exact: true });
    await expect(hemLink).toHaveClass(/nav-link-item--active/);
  });

  test('VÅRA BILAR is active when on /bilar', async ({ page }) => {
    await page.goto(BASE + '/bilar');
    await page.waitForSelector('.site-nav');
    const bilarLink = page.getByRole('link', { name: /VÅRA BILAR/i });
    await expect(bilarLink).toHaveClass(/nav-link-item--active/);
  });

  test('HEM is not active when on /bilar', async ({ page }) => {
    await page.goto(BASE + '/bilar');
    await page.waitForSelector('.site-nav');
    const hemLink = page.getByRole('link', { name: 'HEM', exact: true });
    await expect(hemLink).not.toHaveClass(/nav-link-item--active/);
  });

  // ── Dropdown ──────────────────────────────────────────────────

  test('VÅRA BILAR has a caret indicator', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const caret = page.locator('.nav-item-wrap').filter({ hasText: 'VÅRA BILAR' }).locator('.nav-caret');
    await expect(caret).toBeVisible();
  });

  test('dropdown appears on hover over VÅRA BILAR', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const wrap = page.locator('.nav-item-wrap').filter({ hasText: 'VÅRA BILAR' });
    await wrap.hover();
    const dropdown = wrap.locator('.nav-dropdown');
    await expect(dropdown).toBeVisible();
  });

  test('dropdown contains Nya husbilar and Begagnade husbilar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const wrap = page.locator('.nav-item-wrap').filter({ hasText: 'VÅRA BILAR' });
    await wrap.hover();
    await expect(wrap.getByRole('link', { name: 'Nya husbilar',       exact: true })).toBeVisible();
    await expect(wrap.getByRole('link', { name: 'Begagnade husbilar', exact: true })).toBeVisible();
  });

  test('clicking Nya husbilar navigates to /bilar/nya', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const wrap = page.locator('.nav-item-wrap').filter({ hasText: 'VÅRA BILAR' });
    await wrap.hover();
    await wrap.getByRole('link', { name: 'Nya husbilar', exact: true }).click();
    await expect(page).toHaveURL(BASE + '/bilar/nya/');
  });

  test('clicking Begagnade husbilar navigates to /bilar/begagnade', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const wrap = page.locator('.nav-item-wrap').filter({ hasText: 'VÅRA BILAR' });
    await wrap.hover();
    await wrap.getByRole('link', { name: 'Begagnade husbilar', exact: true }).click();
    await expect(page).toHaveURL(BASE + '/bilar/begagnade/');
  });

  // ── CTA button ────────────────────────────────────────────────

  test('KONTAKTA OSS button is visible and navigates to /kontakt', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const cta = page.locator('.nav-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('KONTAKTA OSS');
    await cta.click();
    await expect(page).toHaveURL(BASE + '/kontakt/');
  });

  // ── Search ────────────────────────────────────────────────────

  test('search input is visible on xl viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 800 });
    const input = page.getByLabel('Sök bilar');
    await expect(input).toBeVisible();
  });

  test('search input is hidden on desktop below xl', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const input = page.getByLabel('Sök bilar');
    await expect(input).not.toBeVisible();
  });

  test('submitting search navigates to /bilar with search param', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 800 });
    const input = page.getByLabel('Sök bilar');
    await input.fill('Adria');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/bilar\?search=Adria/);
  });

  test('empty search does not navigate', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 800 });
    const currentUrl = page.url();
    const input = page.getByLabel('Sök bilar');
    await input.fill('   ');
    await input.press('Enter');
    // URL should not change
    await expect(page).toHaveURL(currentUrl);
  });

  // ── Scroll behaviour ──────────────────────────────────────────

  test('nav gets site-nav--scrolled class after scrolling 51px', async ({ page }) => {
    await page.goto(BASE);
    // Ensure page is tall enough to scroll
    await page.evaluate(() => document.body.style.minHeight = '2000px');
    await page.evaluate(() => window.scrollTo(0, 51));
    await page.waitForTimeout(200);
    await expect(page.locator('.site-nav')).toHaveClass(/site-nav--scrolled/);
  });

  test('nav does not have scrolled class at top of page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await expect(page.locator('.site-nav')).not.toHaveClass(/site-nav--scrolled/);
  });

  // ── Mobile ────────────────────────────────────────────────────

  test('hamburger toggle is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const toggle = page.locator('.navbar-toggler');
    await expect(toggle).toBeVisible();
  });

  test('nav links are hidden on mobile before toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const collapse = page.locator('#main-navbar');
    await expect(collapse).not.toHaveClass(/show/);
  });

  test('nav links expand after hamburger click on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('.navbar-toggler').click();
    await page.waitForTimeout(400); // Bootstrap collapse animation
    const collapse = page.locator('#main-navbar');
    await expect(collapse).toHaveClass(/show/);
  });

});