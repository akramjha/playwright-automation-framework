import { test, expect } from '@playwright/test';
import { SidenavActions } from '../../helpers/lite/sidenavActions';
import { LiteActions } from '../../helpers/lite/liteApp';

const litePath = '/#/lite';
let liteActions: LiteActions;

test.describe('Create activity Flow', () => {
  let liteActions: LiteActions;

  test.afterEach(async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    if (!(await firstRow.isVisible().catch(() => false))) return;
    await firstRow.locator('td').first().click();
    const button = page.getByRole('button', { name: /edit name/i }).first();
    await button.hover();
    const icon = button.locator('svg');
    await expect(icon).toBeVisible();
    await icon.click();

    // verify drawer
    const drawer = page.locator(
      '.fts-design-workflow-drawer .fts-drawer-content',
    );
    await expect(drawer).toBeVisible();
    const deleteBtn = page.locator(
      'body > div.inistate-lite.layout.inistate-lite--design > div.layout__main > div.layout__content > div > div.fts-design-workflow-drawer > div > div > div.info-drawer-actions > button > svg',
    );
    if (!(await deleteBtn.isVisible().catch(() => false))) return;
    await deleteBtn.click();

    // Confirm modal
    const modal = page.locator('.fts-modal.fts-confirmation');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: /Confirm/i }).click();
    await expect(page.getByText(/Action deleted/i)).toBeVisible();
    await expect(drawer.getByText('edit name')).toHaveCount(0);
    await page.mouse.click(330, 0);
    await page.reload();
    await expect(button).not.toBeVisible();
  });

  test('Create Activity', async ({ page }) => {
    liteActions = new LiteActions(page);
    await liteActions.workspace.openLite();
    await liteActions.workspace.designMode();
    await liteActions.workspace.switch('Inistate test 1');
    await liteActions.sidenav.open();
    await liteActions.sidenav.openCollapseMenuAndClickView(
      'Inistate form',
      'Open',
    );

    const header = page.locator('.list-view__header');
    const headerName = header.locator(
      '[data-testid="lite-studio-module-name"]',
    );
    await expect(header).toBeVisible();
    await expect(headerName).toHaveText('Open');

    // Open Row Action Menu
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.locator('td').first().click();

    const viewBtn = page.getByText('visibility View').first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();

    await page.locator('[data-form-load="loaded"]').waitFor();

    const addBtn = page.locator('.form-toggle-more-btn:visible').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Create Action
    const input = page.locator('input[type="text"]').first();
    await input.fill('edit name');
    await page.locator('.toggle-switch-handle').click();

    // Add Field
    await page.getByText('click to add').click();
    await page
      .locator('body > div.fts-popper.append-to-body')
      .locator('.dropdown-option', { hasText: 'name' })
      .click();

    // to trigger new action button
    await page.mouse.click(330, 0);
    const formContainer = page.locator('.form-content__form-container');
    await expect(formContainer).toBeVisible({ timeout: 10000 });
    await page.locator('[data-form-load="loaded"]').waitFor();
    const closeBtn = page.locator(
      '.form-header__right > div:nth-child(3) > .tippy-trigger',
    );
    await expect(closeBtn).toBeVisible({ timeout: 10000 });
    await closeBtn.click();
    const listView = page.locator('.list-view__container.inistate-scroller');
    await expect(listView).toBeVisible({ timeout: 10000 });

    // Edit Row
    const rowAgain = page.locator('tbody tr').first();
    await rowAgain.locator('td').first().click();
    await page
      .getByRole('button', { name: /edit name/i })
      .first()
      .click();
    const editInput = page.locator('input[type="text"]').first();
    await editInput.click();
    await editInput.press('ControlOrMeta+A');
    await editInput.fill('Ali');
    await page
      .getByRole('button', { name: /edit name/i })
      .nth(1)
      .click();

    // Verify
    const row = page.locator('tbody tr').first();
    await expect(row).toContainText('Ali', { timeout: 10000 });
  });
});

test.describe('Edit activity Flow', () => {
  let liteActions: LiteActions;
  test.beforeEach(async ({ page }) => {
    liteActions = new LiteActions(page);
    await liteActions.workspace.openLite();
    await liteActions.workspace.designMode();
    await liteActions.workspace.switch('Inistate test 1');
    await liteActions.sidenav.open();
    await liteActions.sidenav.openCollapseMenuAndClickView(
      'Inistate form',
      'Open',
    );
    const header = page.locator('.list-view__header');
    const headerName = header.locator(
      '[data-testid="lite-studio-module-name"]',
    );
    await expect(header).toBeVisible();
    await expect(headerName).toHaveText('Open');

    // Open Row Action Menu
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.locator('td').first().click();

    const viewBtn = page.getByText('visibility View').first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();

    await page.locator('[data-form-load="loaded"]').waitFor();

    const addBtn = page.locator('.form-toggle-more-btn:visible').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Create Action
    const input = page.locator('input[type="text"]').first();
    await input.fill('edit name');
    await page.locator('.toggle-switch-handle').click();

    // Add Field
    await page.getByText('click to add').click();
    await page
      .locator('body > div.fts-popper.append-to-body')
      .locator('.dropdown-option', { hasText: 'name' })
      .click();

    // to trigger new action button
    await page.mouse.click(330, 0);
    const formContainer = page.locator('.form-content__form-container');
    await expect(formContainer).toBeVisible({ timeout: 10000 });
    await page.locator('[data-form-load="loaded"]').waitFor();
    const closeBtn = page.locator(
      '.form-header__right > div:nth-child(3) > .tippy-trigger',
    );
    await expect(closeBtn).toBeVisible({ timeout: 10000 });
    await closeBtn.click();
    const listView = page.locator('.list-view__container.inistate-scroller');
    await expect(listView).toBeVisible({ timeout: 10000 });

    // Edit Row
    const rowAgain = page.locator('tbody tr').first();
    await rowAgain.locator('td').first().click();
    await page
      .getByRole('button', { name: /edit name/i })
      .first()
      .click();
    const editInput = page.locator('input[type="text"]').first();
    await editInput.click();
    await editInput.press('ControlOrMeta+A');
    await editInput.fill('Ali');
    await page
      .getByRole('button', { name: /edit name/i })
      .nth(1)
      .click();

    // Verify
    const row = page.locator('tbody tr').first();
    await expect(row).toContainText('Ali', { timeout: 10000 });
  });

  test.afterEach(async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    if (!(await firstRow.isVisible().catch(() => false))) return;
    await firstRow.locator('td').first().click();
    const button = page.getByRole('button', { name: /edit name/i }).first();
    await button.hover();
    const icon = button.locator('svg');
    await expect(icon).toBeVisible();
    await icon.click();

    // verify drawer
    const drawer = page.locator(
      '.fts-design-workflow-drawer .fts-drawer-content',
    );
    await expect(drawer).toBeVisible();
    const deleteBtn = page.locator(
      'body > div.inistate-lite.layout.inistate-lite--design > div.layout__main > div.layout__content > div > div.fts-design-workflow-drawer > div > div > div.info-drawer-actions > button > svg',
    );
    if (!(await deleteBtn.isVisible().catch(() => false))) return;
    await deleteBtn.click();

    // Confirm modal
    const modal = page.locator('.fts-modal.fts-confirmation');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: /Confirm/i }).click();
    await expect(page.getByText(/Action deleted/i)).toBeVisible();
    await expect(drawer.getByText('edit name')).toHaveCount(0);
    await page.mouse.click(330, 0);
    await page.reload();
    await expect(button).not.toBeVisible();
  });

  test('Edit Activity', async ({ page }) => {
    test.setTimeout(60000);
    // Open Row Action Menu
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.locator('td').first().click();

    const viewBtn = page.getByText('visibility View').first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();

    const editBtn = page.locator('.form-footer-button', {
      hasText: 'edit name',
    });
    await editBtn.hover();

    const moreIcon = page
      .locator('.form-footer-design-btn .material-icons-outlined', {
        hasText: 'more_vert',
      })
      .last();

    await expect(moreIcon).toBeVisible();
    await moreIcon.scrollIntoViewIfNeeded();
    await moreIcon.hover({ force: true });
    await page.waitForTimeout(300);
    const editAction = page.getByText('Edit action');
    await expect(editAction).toBeVisible({ timeout: 5000 });
    await moreIcon.click();

    const drawer = page.locator(
      'body > div.inistate-lite.layout.inistate-lite--design > div.layout__main > div.layout__content > div > div.fts-design-workflow-drawer > div > div > div.fts-drawer-content',
    );
    await expect(drawer).toBeVisible({ timeout: 10000 });

    const input = page.locator('input[type="text"]').first();
    await input.fill('Edit Name');
    await expect(input).toHaveValue('Edit Name');
    await page.getByText('click to add').click();
    await page
      .locator('body > div.fts-popper.append-to-body')
      .locator('.dropdown-option', { hasText: 'Bio' })
      .click();

    // To go back to module
    await page.mouse.click(330, 0);
    const formContainer = page.locator('.form-content__form-container');
    await expect(formContainer).toBeVisible({ timeout: 10000 });
    await page.locator('[data-form-load="loaded"]').waitFor();
    const closeBtn = page.locator(
      '.form-header__right > div:nth-child(3) > .tippy-trigger',
    );
    await expect(closeBtn).toBeVisible({ timeout: 10000 });
    await closeBtn.click();
    const listView = page.locator('.list-view__container.inistate-scroller');
    await expect(listView).toBeVisible({ timeout: 10000 });

    // Edit row
    await firstRow.locator('td').first().click();
    await page
      .getByRole('button', { name: /Edit Name/i })
      .first()
      .click();
    const editInput = page.locator('input[type="text"]').first();
    await editInput.click();
    await editInput.press('ControlOrMeta+A');
    await editInput.fill('Sam');
    await page
      .getByRole('button', { name: /Edit Name/i })
      .nth(1)
      .click();

    // Verify
    const row = page.locator('tbody tr').first();
    await expect(row).toContainText('Sam', { timeout: 10000 });
  });
});

test.describe('Delete activity Flow', () => {
  test.beforeEach(async ({ page }) => {
    liteActions = new LiteActions(page);
    await liteActions.workspace.openLite();
    await liteActions.workspace.designMode();
    await liteActions.workspace.switch('Inistate test 1');
    await liteActions.sidenav.open();
    await liteActions.sidenav.openCollapseMenuAndClickView(
      'Inistate form',
      'Open',
    );
    const header = page.locator('.list-view__header');
    const headerName = header.locator(
      '[data-testid="lite-studio-module-name"]',
    );
    await expect(header).toBeVisible();
    await expect(headerName).toHaveText('Open');

    // Open Row Action Menu
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.locator('td').first().click();

    const viewBtn = page.getByText('visibility View').first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();

    await page.locator('[data-form-load="loaded"]').waitFor();

    const addBtn = page.locator('.form-toggle-more-btn:visible').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Create Action
    const input = page.locator('input[type="text"]').first();
    await input.fill('edit name');
    await page.locator('.toggle-switch-handle').click();

    // Add Field
    await page.getByText('click to add').click();
    await page
      .locator('body > div.fts-popper.append-to-body')
      .locator('.dropdown-option', { hasText: 'name' })
      .click();

    // to trigger new action button
    await page.mouse.click(330, 0);
    const formContainer = page.locator('.form-content__form-container');
    await expect(formContainer).toBeVisible({ timeout: 10000 });
    await page.locator('[data-form-load="loaded"]').waitFor();
    const closeBtn = page.locator(
      '.form-header__right > div:nth-child(3) > .tippy-trigger',
    );
    await expect(closeBtn).toBeVisible({ timeout: 10000 });
    await closeBtn.click();
    const listView = page.locator('.list-view__container.inistate-scroller');
    await expect(listView).toBeVisible({ timeout: 10000 });

    // Edit Row
    const rowAgain = page.locator('tbody tr').first();
    await rowAgain.locator('td').first().click();
    await page
      .getByRole('button', { name: /edit name/i })
      .first()
      .click();
    const editInput = page.locator('input[type="text"]').first();
    await editInput.click();
    await editInput.press('ControlOrMeta+A');
    await editInput.fill('Ali');
    await page
      .getByRole('button', { name: /edit name/i })
      .nth(1)
      .click();

    // Verify
    const row = page.locator('tbody tr').first();
    await expect(row).toContainText('Ali', { timeout: 10000 });
  });

  test('Delete Activity', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    if (!(await firstRow.isVisible().catch(() => false))) return;
    await firstRow.locator('td').first().click();
    const button = page.getByRole('button', { name: /edit name/i }).first();
    await button.hover();
    const icon = button.locator('svg');
    await expect(icon).toBeVisible();
    await icon.click();

    // verify drawer
    const drawer = page.locator(
      '.fts-design-workflow-drawer .fts-drawer-content',
    );
    await expect(drawer).toBeVisible();
    const deleteBtn = page.locator(
      'body > div.inistate-lite.layout.inistate-lite--design > div.layout__main > div.layout__content > div > div.fts-design-workflow-drawer > div > div > div.info-drawer-actions > button > svg',
    );
    if (!(await deleteBtn.isVisible().catch(() => false))) return;
    await deleteBtn.click();

    // Confirm modal
    const modal = page.locator('.fts-modal.fts-confirmation');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: /Confirm/i }).click();
    await expect(page.getByText(/Action deleted/i)).toBeVisible();
    await expect(drawer.getByText('edit name')).toHaveCount(0);
    await page.mouse.click(330, 0);
    await page.reload();
    await expect(button).not.toBeVisible();
  });
});
