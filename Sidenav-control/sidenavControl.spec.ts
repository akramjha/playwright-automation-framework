import { test, expect } from '@playwright/test';
import { LiteActions } from '../../helpers/lite/liteApp';

let liteActions: LiteActions;

test.beforeEach(async ({ page }) => {
  liteActions = new LiteActions(page);
});

test('Sidenav control Web + Edit', async ({ page }) => {
  await liteActions.workspace.openLite();

  const editBtn = liteActions.workspace.designModeButton();
  await expect(await liteActions.workspace.designModeTooltip()).toBe('Edit');
  await liteActions.workspace.designMode();
  const content = page.locator('.list-view__container.inistate-scroller');
  await expect(content).toBeVisible({ timeout: 30000 });
  await expect(editBtn).toHaveClass(/active|selected|is-active/);

  // add module
  await expect(await liteActions.sidenav.openModuleHubTooltip()).toBe(
    'Add module',
  );
  await liteActions.module.openHub();

  // to module hub page
  const topnav = page.locator('.layout__topnav');
  await expect(topnav).toBeVisible({ timeout: 30000 });
  await expect(topnav).toHaveText('Module Hub');

  // click module
  await liteActions.sidenav.openMenu('Staff');
  const moduleName = page.locator('.list-view__header-name', {
    hasText: 'Staff',
  });
  await expect(moduleName).toBeVisible();
  await liteActions.sidenav.openCollapseMenu('Inistate Form');
  const module = liteActions.sidenav.menuByName('Inistate Form');
  //   await module.hover();

  // hover and expect tooltip studio
  await expect(await liteActions.sidenav.menuEditTooltip('Inistate Form')).toBe(
    'Open mini studio',
  );

  await page.mouse.click(1, 1);

  // hover and expect tooltip new view
  await expect(await liteActions.sidenav.menuAddTooltip('Inistate Form')).toBe(
    'New view',
  );

  await page.mouse.click(1, 1);

  // listing
  const list = liteActions.sidenav.viewByName('Open');
  await expect(list).toBeVisible();
  //   await list.hover();

  // edit view hover
  await expect(await liteActions.sidenav.viewEditTooltip('Open')).toBe(
    'Edit view',
  );

  await page.mouse.click(1, 1);

  // new view hover
  await expect(await liteActions.sidenav.viewAddTooltip('Open')).toBe(
    'New view',
  );

  await page.mouse.click(1, 1);

  // module tooltip
  await module.hover({ force: true });
  const moduleTooltip = page.locator('.tippy-content:visible');
  await expect(moduleTooltip).toBeVisible();
});

test('Sidenav control Edit', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.designMode();
  await liteActions.workspace.switch('Inistate test 1');
  await liteActions.sidenav.open();
  await liteActions.sidenav.openCollapseMenuAndClickView(
    'Inistate form',
    'Open',
  );

  // listing
  const list = liteActions.sidenav.viewByName('Open');
  await expect(list).toBeVisible();
  await list.hover();

  // edit view hover
  const editViewBtn = await liteActions.sidenav.viewEditButton('Open');
  await expect(await liteActions.sidenav.viewEditTooltip('Open')).toBe(
    'Edit view',
  );

  await editViewBtn.click();
  const drawerHeader = page.locator('.listing-drawer-header-content');
  await expect(drawerHeader).toBeVisible();
  await expect(drawerHeader.locator('.listing-drawer-header-title')).toHaveText(
    /Edit view/i,
  );
  await page.mouse.click(330, 0);

  // new view button
  const plusBtn = await liteActions.sidenav.viewAddButton('Open');
  await plusBtn.click();
  await expect(drawerHeader).toBeVisible();
  await expect(drawerHeader.locator('.listing-drawer-header-title')).toHaveText(
    /New view/i,
  );
  await page.mouse.click(330, 0);

  const studioBtn = await liteActions.sidenav.menuEditButton('Inistate Form');
  await studioBtn.click();
  const header = page.locator('.list-view__header');
  await expect(header).toBeVisible();
  await expect(
    page.locator('[data-testid="lite-studio-module-name"]'),
  ).toHaveText('Inistate Form');

  // new view button
  const addBtn = await liteActions.sidenav.menuAddButton('Inistate Form');
  await addBtn.click();
  const viewNameInput = page.locator(
    'input.listing-name-input[placeholder="Name this view"]',
  );
  await expect(viewNameInput).toBeVisible();
  await page.mouse.click(330, 0);
});

test('Sidenav control Web', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.webMode();

  // verify
  await expect(page.locator('.layout__sidenav')).toBeVisible();
  const workspaceName = page.locator('.sidenav__workspace-label');
  await expect(workspaceName).toBeVisible();
  await expect(workspaceName).not.toHaveAttribute('contenteditable', 'true');

  const configureBtn = page.locator('.sidenav__action-btn').filter({
    has: page.locator('span.material-icons-outlined', {
      hasText: 'settings',
    }),
  });
  await expect(configureBtn).toHaveCount(0);

  // no pen and add
  const module = page.locator('.module-wrapper').first();
  await module.hover();
  const penIcon = module.locator('span.material-icons-outlined', {
    hasText: 'edit',
  });
  const plusIcon = module.locator('span.material-icons-outlined', {
    hasText: 'add',
  });
  await expect(penIcon).toHaveCount(0);
  await expect(plusIcon).toHaveCount(0);
});

test('Sidenav control App', async ({ page }) => {
  await liteActions.workspace.openLite();

  await liteActions.workspace.appMode();

  // verify mobile page
  const deviceApp = page.locator('.device-app-container');
  await expect(deviceApp).toBeVisible();
  const iframe = deviceApp.locator('iframe.device-app-content');
  await expect(iframe).toBeVisible();

  const onboarding = page.locator('.device-preview__onboarding');
  await expect(onboarding.getByText('Download mobile app')).toBeVisible();
  await expect(onboarding.locator('.onboarding-qr-code svg')).toBeVisible();
  const copyBtn = onboarding.getByRole('button', { name: 'Copy link' });
  await expect(copyBtn).toBeVisible();
});

test('Sidenav collapse control web', async ({ page }) => {
  await liteActions.workspace.openLite();
  await liteActions.workspace.webMode();
  await liteActions.sidenav.openMenu('Country');

  await liteActions.sidenav.close();

  const header = page.locator('.list-view__header');
  await expect(header).toBeVisible();

  const fabToggleBtn = page.locator('button.fab-control-toggle');
  await expect(fabToggleBtn).toBeVisible();
  await fabToggleBtn.click();

  const fab = page.locator('.fab-control');
  await expect(fab).toBeVisible();

  const edit = fab.locator('.fab-control-item', { hasText: 'Edit' });
  const web = fab.locator('.fab-control-item', { hasText: 'Web' });
  const app = fab.locator('.fab-control-item', { hasText: 'App' });

  await expect(edit).toBeVisible({ timeout: 5000 });
  await expect(web).toBeVisible({ timeout: 5000 });
  await expect(app).toBeVisible({ timeout: 5000 });

  // edit button
  await edit.click();
  await expect(header).toBeVisible({ timeout: 10000 });
  await expect(header.locator('.list-view__header-name')).toHaveText(
    'Country',
    { timeout: 5000 },
  );
  await expect(edit).toBeVisible({ timeout: 5000 });

  await fabToggleBtn.click();
  await expect(edit).toBeVisible({ timeout: 5000 });
  await expect(web).toBeVisible({ timeout: 5000 });
  await expect(app).toBeVisible({ timeout: 5000 });
  const fabCloseBtn = page.locator('button.fab-control-toggle svg.fa-xmark');
  await expect(fabCloseBtn).toBeVisible({ timeout: 5000 });

  // web button
  await web.click();
  await expect(header).toBeVisible({ timeout: 10000 });
  await expect(header.locator('.list-view__header-name')).toHaveText(
    'Country',
    { timeout: 5000 },
  );
  await expect(web).toBeVisible({ timeout: 5000 });

  await fabToggleBtn.click();
  await expect(edit).toBeVisible({ timeout: 5000 });
  await expect(web).toBeVisible({ timeout: 5000 });
  await expect(app).toBeVisible({ timeout: 5000 });
  await expect(fabCloseBtn).toBeVisible({ timeout: 5000 });

  // app button
  await app.click();
  const deviceApp = page.locator('.device-app-container');
  await expect(deviceApp).toBeVisible();
  const iframe = deviceApp.locator('iframe.device-app-content');
  await expect(iframe).toBeVisible();
  await expect(app).toBeVisible({ timeout: 5000 });

  await fabToggleBtn.click();
  await expect(edit).toBeVisible({ timeout: 5000 });
  await expect(web).toBeVisible({ timeout: 5000 });
  await expect(app).toBeVisible({ timeout: 5000 });
  await expect(fabCloseBtn).toBeVisible({ timeout: 5000 });
});
