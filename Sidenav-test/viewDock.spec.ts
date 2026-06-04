import { test, expect } from '@playwright/test';
import { SidenavActions } from '../../helpers/lite/sidenavActions';
import { LiteActions } from '../../helpers/lite/liteApp';

const litePath = '/#/lite';
let sidenavActions: SidenavActions;
let liteActions: LiteActions;

test.beforeEach(async ({ page }) => {
  sidenavActions = new SidenavActions(page);
  liteActions = new LiteActions(page);
});

test('Close Open Sidenav', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.webMode();

  // close
  const toggleIcon = await liteActions.sidenav.closeSidenavButton();
  await expect(toggleIcon).toBeVisible();
  await toggleIcon.hover();
  const tooltip = await liteActions.sidenav.closeSidenavButtonTooltip();
  await expect(tooltip).toBe('Close sidenav');
  await liteActions.sidenav.close();

  // open
  await liteActions.sidenav.open();
  await expect(liteActions.sidenav.isOpen()).toBeTruthy();
});

test('Search sidenav', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.webMode();

  const tooltip = await liteActions.sidenav.searchButtonTooltip();
  await expect(tooltip).toBe('Search');

  await liteActions.sidenav.openSearch();
  const searchInput = liteActions.sidenav.searchInput();
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeEditable();
  await liteActions.sidenav.search('Inistate Form');
  await expect(searchInput).toHaveValue('Inistate Form');
  await liteActions.sidenav.expectSearchResultVisible('Inistate Form');

  await liteActions.sidenav.closeSearch();
  await liteActions.sidenav.expectSearchClosed();
});

test('Expand menu sidenav', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.webMode();
  await liteActions.sidenav.openCollapseMenu("Inistate Form")

  const openView = await liteActions.sidenav.viewByName("Open");
  const activeView = await liteActions.sidenav.viewByName("Active");
  const inactiveView = await liteActions.sidenav.viewByName("Inactive");

  await expect(openView).toBeVisible();
  await expect(activeView).toBeVisible();
  await expect(inactiveView).toBeVisible();
});

test('Collapse all menu', async ({ page }) => {
    await liteActions.workspace.openLite();
    await liteActions.workspace.webMode();
    await liteActions.sidenav.openCollapseMenu("Inistate Form")

    const openView = await liteActions.sidenav.viewByName("Open");
    const activeView = await liteActions.sidenav.viewByName("Active");
    const inactiveView = await liteActions.sidenav.viewByName("Inactive");

    await expect(openView).toBeVisible();
    await expect(activeView).toBeVisible();
    await expect(inactiveView).toBeVisible();

    const collapseBtn = page.locator('span.material-icons-outlined',{ hasText: 'unfold_less' }).first();
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.hover();
    await expect(page.locator('.tippy-content', { hasText: 'Collapse all views' })).toBeVisible({ timeout: 10000 });
    await collapseBtn.click();
    await expect(page.locator('.module-wrapper--open')).toHaveCount(0);
    await liteActions.sidenav.openCollapseMenu("Inistate Form")
    await expect(openView).toBeVisible();
})

test('Module with listing', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.designMode();

  const module = liteActions.sidenav.menuByName('Inistate Form');
  const isOpen = await module.evaluate((el) =>
    el.classList.contains('module-wrapper--open'),
  );
  await module.click();
  await expect(module).toHaveClass(
    isOpen ? /^(?!.*module-wrapper--open).*$/ : /module-wrapper--open/,
  );
  await module.click();
  await expect(module).toHaveClass(
    isOpen ? /module-wrapper--open/ : /^(?!.*module-wrapper--open).*$/,
  );

  const editBtn = await liteActions.sidenav.menuEditButton('Inistate Form');
  await expect(editBtn).toBeVisible();
  await editBtn.click();

  const header = page.locator('.list-view__header');
  await expect(header).toBeVisible();
  await expect(
    page.locator('[data-testid="lite-studio-module-name"]'),
  ).toHaveText('Inistate Form');

  // open list
  const openList = page.locator('.view-tab span.name', { hasText: 'Open' });
  await openList.click();
  await expect(
    page.locator('[data-testid="lite-studio-module-name"]'),
  ).toHaveText('Open', { timeout: 10000 });

  // active list
  const activeList = page
    .locator('.view-tab span.name', { hasText: 'Active' })
    .first();
  await activeList.click();
  await expect(
    page.locator('[data-testid="lite-studio-module-name"]'),
  ).toHaveText('Active', { timeout: 10000 });

  // inactive list
  const inactiveList = page
    .locator('.view-tab span.name', { hasText: 'Inactive' })
    .first();
  await inactiveList.click();
  await expect(
    page.locator('[data-testid="lite-studio-module-name"]'),
  ).toHaveText('Inactive', { timeout: 10000 });
});

test('Module without listing', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.designMode();

  await liteActions.sidenav.openMenu('Staff');
  const staffModule = page.locator('.list-view__header-name', {
    hasText: 'Staff',
  });
  await expect(staffModule).toBeVisible({ timeout: 30000 });

  const staffMenu = liteActions.sidenav.menuByName('Staff');
  await expect(staffMenu).toBeVisible({ timeout: 30000 });

  const editBtn = await liteActions.sidenav.menuEditButton('Staff');
  await expect(editBtn).toBeVisible();
  await editBtn.click();
  const viewBar = page.locator('.view-bar');
  await expect(viewBar).toBeVisible({ timeout: 30000 });
  await expect(viewBar.locator('.view-tab')).toBeVisible();
  await expect(viewBar.locator('.view-tab__active .name')).toHaveText('All');

  // open listing
  await liteActions.sidenav.openMenu('Staff');
  await expect(staffModule).toBeVisible({ timeout: 30000 });
});
