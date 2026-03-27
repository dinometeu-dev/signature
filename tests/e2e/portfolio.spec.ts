import { expect, test, type Page } from '@playwright/test';

const waitForSlideQuery = async (page: Page, slide: string) => {
  await expect
    .poll(() => new URL(page.url()).searchParams.get('slide'))
    .toBe(slide);
};

test('arrow-key navigation updates the active slide query', async ({
  page,
}) => {
  await page.goto('/signature');

  await expect(
    page.getByRole('button', { name: /let's talk/i })
  ).toBeVisible();

  await page.keyboard.press('ArrowDown');

  await waitForSlideQuery(page, 'profile');
  await expect(page.getByText('Shall we get acquainted?')).toBeVisible();
});

test('direct work slide links preserve the requested work item', async ({
  page,
}) => {
  await page.goto('/signature?slide=works&id=2');

  await waitForSlideQuery(page, 'works');
  await expect
    .poll(() => new URL(page.url()).searchParams.get('id'))
    .toBe('2');
  await expect(page.getByText('Magic Math')).toBeVisible();

  await page.keyboard.press('ArrowDown');

  await expect
    .poll(() => new URL(page.url()).searchParams.get('id'))
    .toBe('3');
  await expect(page.getByText('Amigo Car')).toBeVisible();
});

test('long press opens the menu and escape closes it', async ({ page }) => {
  await page.goto('/signature?slide=profile');

  await expect(page.getByText('Shall we get acquainted?')).toBeVisible();

  await page.mouse.move(80, 80);
  await page.mouse.down();
  await page.waitForTimeout(950);
  await page.mouse.up();

  const closeButton = page.getByRole('button', { name: /close/i });
  await expect(closeButton).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(closeButton).not.toBeVisible();
});

test('the airplane CTA transitions to the contact slide', async ({ page }) => {
  await page.goto('/signature');

  const ctaButton = page.getByRole('button', { name: /let's talk/i });
  await expect(ctaButton).toBeVisible();

  await ctaButton.click();

  await waitForSlideQuery(page, 'contact');
  await expect(page.getByText("Let's get in touch!")).toBeVisible();
});
