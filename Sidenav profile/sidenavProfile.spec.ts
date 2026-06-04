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

test('Sidenav profile', async ({ page }) => {
    await liteActions.workspace.openLite();
    await liteActions.workspace.webMode();

    const profile = page.locator('.sidenav__profile-container');
    await expect(profile.locator('.profile-photo')).toBeVisible();
    await expect(profile.locator('.sidenav__profile-name')).toBeVisible();
    await expect(profile.locator('.sidenav__profile-name')).not.toBeEmpty();
    await expect(profile.locator('.sidenav__profile-username')).toBeVisible();
    await expect(profile.locator('.sidenav__profile-username')).toContainText('@');

    const settingsBtn = page.locator('.sidenav-settings');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const modalHeader = page.locator('.fts-modal-header.client-modal__header');
    await expect(modalHeader).toBeVisible({ timeout: 10000 });
    await expect(modalHeader.locator('.client-modal-header-title')).toHaveText('Account');

    const crossBtn = page.locator('button:has(svg[data-icon="xmark"])').first();
    await expect(crossBtn).toBeVisible({ timeout: 10000 });

    const modal = page.locator('.user-profile-modal__body');
    await expect(modal.getByText('profile', { exact: true })).toBeVisible();
    await expect(modal.getByText('password', { exact: true })).toBeVisible();
    await expect(modal.getByText('integration', { exact: true })).toBeVisible();
    const logoutBtn = page.getByRole('button', { name: 'Log Out' });
    await expect(logoutBtn).toBeVisible({ timeout: 10000 });

    const footer = page.locator('.client-modal-footer__r');
    const closeBtn = footer.getByRole('button', { name: 'Close' });
    await expect(closeBtn).toBeVisible();
    const updateBtn = footer.getByRole('button', { name: 'Update' });
    await expect(updateBtn).toBeVisible();

    await crossBtn.click();
    await expect(modal).toBeHidden({ timeout: 10000 });

    await settingsBtn.click();
    await expect(modalHeader).toBeVisible({ timeout: 10000 });
    await expect(modalHeader.locator('.client-modal-header-title')).toHaveText('Account');
    await crossBtn.click();
    await expect(modal).toBeHidden({ timeout: 10000 });
})

test('Sidenav profile update', async ({ page }) => {
    await liteActions.workspace.openLite();
    await liteActions.workspace.webMode();

    const settingsBtn = page.locator('.sidenav-settings');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const modalHeader = page.locator('.fts-modal-header.client-modal__header');
    await expect(modalHeader).toBeVisible({ timeout: 10000 });
    await expect(modalHeader.locator('.client-modal-header-title')).toHaveText('Account');

    const profileTab = page.locator('.user-profile-tab', { hasText: 'profile' });
    await expect(profileTab).toHaveClass(/active/);

    const modal = page.locator('.user-profile-modal__body');
    const profilePic = modal.locator('.profile-photo-wrapper img');
    const beforeSrc = await profilePic.getAttribute('src');
    const fileInput = modal.locator('.avatar-cropper-img-input');
    await fileInput.setInputFiles('screenshot/Screenshot 1.png');
    const doneBtn = modal.getByRole('button', { name: 'Done' });
    await expect(doneBtn).toBeVisible();
    await doneBtn.click();
    await expect.poll(async () => {return await profilePic.getAttribute('src');}).not.toBe(beforeSrc);
    
    // Display Name 
    const displayName = modal.locator('label:has-text("Display Name") + .form-element-content input');
    await expect(displayName).toBeVisible();
    await expect(displayName).toBeEditable();
    await displayName.fill('Test update');

    // First Name
    const firstName = modal.locator('label:has-text("First Name") + .form-element-content input');
    await expect(firstName).toBeVisible();
    await expect(firstName).toBeEditable();
    await firstName.fill('Test');

    // Last Name
    const lastName = modal.locator('label:has-text("Last Name") + .form-element-content input');
    await expect(lastName).toBeVisible();
    await expect(lastName).toBeEditable();
    await lastName.fill('Test');

    // Phone Number
    const phoneInput = modal.locator('.phone-number__input');
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toBeEditable();
    await phoneInput.fill('34567890');

    // Email
    const email = modal.locator('label:has-text("Email") + .form-element-content input');
    await expect(email).toBeVisible();
    await expect(email).toBeEditable();
    await email.fill('test@test.com')

    const footer = page.locator('.client-modal-footer__r');
    const updateBtn = footer.getByRole('button', { name: 'Update' });
    await expect(updateBtn).toBeVisible();
    await updateBtn.click();
    await expect(updateBtn).toBeDisabled({ timeout: 5000 });

    await expect(page.locator('.user-profile-modal__body')).toBeHidden({ timeout: 15000 });
    const toast = page.getByText('Profile updated successfully.', { exact: false });
    await expect(toast).toBeVisible({ timeout: 15000 });

    const sidenav = page.locator('.sidenav__profile-container');
    const displayNameNav = sidenav.locator('.sidenav__profile-name');
    await expect(displayNameNav).toHaveText('Test update', { timeout: 10000 });
    const avatar = sidenav.locator('.profile-photo');
    await expect.poll(async () => {return await avatar.getAttribute('style');}).toContain('Screenshot 1.png');

    await settingsBtn.click();
    await expect(modal).toBeVisible();
    await expect(displayName).toHaveValue('Test update');
    await expect(firstName).toHaveValue('Test');
    await expect(lastName).toHaveValue('Test');
    await expect(phoneInput).toHaveValue('34567890');
    await expect(email).toHaveValue('test@test.com');
    const closeBtn = footer.getByRole('button', { name: 'Close' });
    await closeBtn.click();
    await expect(page.locator('.user-profile-modal__body')).toBeHidden({ timeout: 15000 });

})

test('Sidenav profile password', async ({ page }) => {
    await liteActions.workspace.openLite();
    await liteActions.workspace.webMode();

    const settingsBtn = page.locator('.sidenav-settings');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const modalHeader = page.locator('.fts-modal-header.client-modal__header');
    await expect(modalHeader).toBeVisible({ timeout: 10000 });
    await expect(modalHeader.locator('.client-modal-header-title')).toHaveText('Account');

    const modal = page.locator('.user-profile-modal__body');
    await expect(modal).toBeVisible();
    const passwordTab = modal.getByText('password', { exact: true });
    await expect(passwordTab).toBeVisible();
    await passwordTab.click();
    const activeTab = modal.locator('.user-profile-tab.active');
    await expect(activeTab).toHaveText(/password/i);

    const form = modal.locator('form');
    await expect(form).toBeVisible();

    const currentPassword = modal.locator('label:has-text("Current Password") + .form-element-content input');
    const newPassword = modal.locator('label:has-text("New Password"):not(:has-text("Confirm")) + .form-element-content input');
    const confirmPassword = modal.locator('label:has-text("Confirm New Password") + .form-element-content input');

    await expect(currentPassword).toBeVisible();
    await expect(currentPassword).toBeEditable();
    await currentPassword.fill('Password@12345');

    await expect(newPassword).toBeVisible();
    await expect(newPassword).toBeEditable();
    await newPassword.fill('Password@12345');

    await expect(confirmPassword).toBeVisible();
    await expect(confirmPassword).toBeEditable();
    await confirmPassword.fill('Password@12345');

    const footer = page.locator('.client-modal-footer__r');
    const updateBtn = footer.getByRole('button', { name: 'Update' });
    await expect(updateBtn).toBeVisible();
    await updateBtn.click();
    await expect(page.locator('.user-profile-modal__body')).toBeHidden({ timeout: 15000 });

    await expect(page.locator('.user-profile-modal__body')).toBeHidden({ timeout: 15000 });
    const toast = page.getByText('Password updated successfully.', { exact: false });
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toBeHidden({ timeout: 10000 });

    await settingsBtn.click();
    await expect(modalHeader).toBeVisible({ timeout: 10000 });
    await expect(modalHeader.locator('.client-modal-header-title')).toHaveText('Account');
    const logoutBtn = page.locator('button', { hasText: 'Log Out' });
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    await expect(page).toHaveURL(/login|sign-in/i);
    const loginForm = page.locator('form[novalidate]');
    await expect(loginForm).toBeVisible();

    // inputs
    const emailInput = loginForm.getByPlaceholder('Email');
    const passwordInput = loginForm.getByPlaceholder('Password');
    const signInBtn = loginForm.getByRole('button', { name: /sign in/i });

    // wrong email and password input
    await emailInput.fill('oldemail@test.com');
    await passwordInput.fill('oldpassword@12345');
    await signInBtn.click();

    const wrongtoast = page.getByText('Username invalid', { exact: false });
    await expect(wrongtoast).toBeVisible({ timeout: 15000 });
    await expect(wrongtoast).toBeHidden({ timeout: 10000 });

    await emailInput.fill('test@test.com');
    await passwordInput.fill('Password@12345');

    // verify values
    await expect(emailInput).toHaveValue('test@test.com');
    await expect(passwordInput).toHaveValue('Password@12345');

    await Promise.all([page.waitForURL(/dashboard/, { timeout: 20000 }),signInBtn.click()]);
    await expect(page).toHaveURL(/dashboard/);
    await liteActions.workspace.openLite();
    await expect(page.getByTestId('lite-control-web')).toBeVisible({ timeout: 20000 });
    await liteActions.workspace.webMode();

})

test('Sidenav profile integration', async ({ page }) => {
    await liteActions.workspace.openLite();
    await liteActions.workspace.webMode();

    const settingsBtn = page.locator('.sidenav-settings');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const modal = page.locator('.user-profile-modal__body');
    await expect(modal).toBeVisible();
    const integrationTab = modal.getByText('integration', { exact: true });
    await expect(integrationTab).toBeVisible();
    await integrationTab.click();
    const activeTab = modal.locator('.user-profile-tab.active');
    await expect(activeTab).toHaveText(/integration/i);

    const apiKeyBtn = page.getByRole('button', { name: /generate api key/i });
    await expect(apiKeyBtn).toBeVisible();
    await apiKeyBtn.click();
    await expect(apiKeyBtn).toBeDisabled();

    // API 
    const apiKeyWrapper = page.locator('.user-integration-api-key-wrapper');
    const apiKeyText = apiKeyWrapper.locator('.user-integration-api-key');
    await expect(apiKeyText).toBeVisible();
    await expect(apiKeyText).not.toBeEmpty();
    const rawKey = await apiKeyText.textContent();
    expect(rawKey?.replace(/\s/g, '')).toMatch(/^[a-f0-9-]+:[a-f0-9]+$/i);

    // copy button 
    const copyBtn = apiKeyWrapper.getByRole('button');
    await expect(copyBtn).toBeVisible();
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    const expectedKey = (await apiKeyText.textContent())?.trim();
    await copyBtn.click();
    await expect(page.getByText(/copied/i)).toBeVisible();
    await page.waitForTimeout(300);
    const footer = page.locator('.client-modal-footer__r');
    const closeBtn = footer.getByRole('button', { name: 'Close' });
    await closeBtn.click();
    await expect(page.locator('.user-profile-modal__body')).toBeHidden({ timeout: 15000 });
})