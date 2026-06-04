import { test, expect } from '@playwright/test';
import { LiteActions } from '../../helpers/lite/liteApp';

test.describe('Sidenav Control + Switch Workspace', () => {
  let liteActions: LiteActions;
  test.beforeEach(async ({ page }) => {
    liteActions = new LiteActions(page);
    await liteActions.workspace.openLite();
    await liteActions.workspace.switch('test 1');
  });

  test('Sidenav Control (Edit)', async ({ page }) => {
    await liteActions.workspace.designMode();
    await liteActions.workspace.switch('Test 1');

    const designButton = liteActions.workspace.designModeButton();
    await expect(designButton).toHaveClass(
      'topnav__control-item topnav__control-item--active',
    );

    await expect(page.locator('.list-view__header')).toBeVisible();
  });

  test('Sidenav Control (Web)', async ({ page }) => {
    await liteActions.workspace.webMode();
    await liteActions.workspace.switch('Test 1');

    const webButton = liteActions.workspace.webModeButton();
    await expect(webButton).toHaveClass(
      'topnav__control-item topnav__control-item--active-outline',
    );

    await expect(page.locator('.list-view__header')).toBeVisible();
  });

  test('Sidenav Control (App)', async ({ page }) => {
    await liteActions.workspace.appMode();
    await liteActions.workspace.switch('Test 1');

    const appButton = liteActions.workspace.appModeButton();
    await expect(appButton).toHaveClass(
      'topnav__control-item topnav__control-item--active-outline',
    );

    await expect(page.locator('.fts-device')).toBeVisible();
  });
});
