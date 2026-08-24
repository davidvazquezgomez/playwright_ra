import { BasePage } from './BasePage';
import * as OTPAuth from 'otpauth';

/**
 * LoginPage — Page Object for the authentication flow.
 *
 */
export class LoginPage extends BasePage {

  private useAnotherAccountButton = '#otherTile[role="button"]';
  private emailInput = "input[type='email']:not([aria-hidden='true']), input[name='loginfmt']:not([aria-hidden='true'])";
  private nextButton = "input[type='submit']";
  private passwordInput = "input[type='password']";
  private profileInitials = 'div.profile-initials';
  private logoutButton = 'a:text-is("Log out")';
  private logoutAccountTile = '#tilesHolder [role="button"][aria-label^="Cierre sesión"], #tilesHolder [role="button"][aria-label^="Sign out"]';
  private accountSelectionHeading = '#loginHeader [role="heading"]';
  private accountSelectionList = '#tilesHolder[role="list"]';
  private oneTimePasswordInput = "input[placeholder='Code']";
  private invalidOneTimePasswordAlert = '[role="alert"]:has-text("code is invalid")';
  private selectWorkAccount = '//div[text()="Work or school account"]';
  private emailInputGA = "input[type='text']";
  private continueButtonGA = "div[class='continue-button'] button";
  private passwordInputGA = "input[type='password']";

  /**
    * Performs login with username and password.
   *
   * This implementation uses a two-step login flow (email → next → password → submit).
   * Adapt to your client's authentication flow as needed.
   *
   * @param username Username / email
   * @param password Password
  * @param totpSecret Optional TOTP secret for multi-factor authentication.
   */
  async login(username: string, password: string, totpSecret: string): Promise<void> {
    // Step 1 — Enter email
    await this.selectAnotherAccountWhenPresented();
    try {
      await this.waitForSelectorStatus(this.emailInput, 'visible');
    } catch (error) {
      const [url, title] = await Promise.all([this._page.url(), this._page.title()]);
      throw new Error(
        `Microsoft email input was not displayed. Current URL: ${url}. Current title: ${title}. ` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    await this.fillInputText(this.emailInput, username);

    // Step 2 — Click Next (remove if single-step login)
    await this.waitForSelectorStatus(this.nextButton, 'visible');
    await this.waitForElement(this.nextButton);
    await this.clickElement(this.nextButton);

    // Step 3 — Select account if multiple accounts are present (optional)
    await this.clickElementWithoutError(this.selectWorkAccount, 3000);

    // Step 4 — Enter password
    await this.waitForSelectorStatus(this.emailInput, 'hidden');
    await this.waitForSelectorStatus(this.passwordInput, 'visible');
    await this.waitForElement(this.passwordInput);
    const passwordField = this._page.locator(this.passwordInput);
    await passwordField.pressSequentially(password, { delay: 100 });

    // Step 5 — Submit
    await this.clickElement(this.nextButton);

    if (totpSecret) {

      // MFA code
      await this.waitForSelectorStatus(this.oneTimePasswordInput, 'visible');

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(totpSecret.replace(/\s/g, '').toUpperCase()),
        digits: 6,
        period: 30,
        algorithm: 'SHA1',
      });

      if (totp.remaining() < 2000) {
        await this._page.waitForTimeout(totp.remaining() + 100);
      }

      const currentOtp = totp.generate();

      const oneTimePasswordField = this._page.locator(this.oneTimePasswordInput);
      await oneTimePasswordField.pressSequentially(currentOtp, { delay: 100 });
      await this.clickElement(this.nextButton);

      const invalidOneTimePasswordAlert = this._page.locator(this.invalidOneTimePasswordAlert);
      const mfaResult = await Promise.race([
        this.waitForAccessConfirmation().then(() => 'authenticated' as const),
        invalidOneTimePasswordAlert.waitFor({ state: 'visible' }).then(() => 'invalid-code' as const),
      ]);

      if (mfaResult === 'invalid-code') {
        await this._page.waitForTimeout(totp.remaining() + 100);
        await oneTimePasswordField.fill(totp.generate());
        await this.clickElement(this.nextButton);
        await invalidOneTimePasswordAlert.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => undefined);

        const retryResult = await Promise.race([
          this.waitForAccessConfirmation().then(() => 'authenticated' as const),
          invalidOneTimePasswordAlert.waitFor({ state: 'visible' }).then(() => 'invalid-code' as const),
        ]);

        if (retryResult === 'invalid-code') {
          throw new Error(
            'The one-time password was rejected after retrying. Verify the TOTP secret and system clock for this user.',
          );
        }
      }
    }

    if (!totpSecret) {
      await this.waitForAccessConfirmation();
    }
  }

  /**
   * Selects Microsoft's alternate-account option when a previously authenticated account is offered.
   */
  private async selectAnotherAccountWhenPresented(): Promise<void> {
    await this.clickElementWithoutError(this.useAnotherAccountButton, 5000);
  }

  async loginGA(username: string, password: string): Promise<void> {
    // Step 1 — Enter email
    await this.waitForSelectorStatus(this.emailInputGA, 'visible');
    await this.fillInputText(this.emailInputGA, username);

    // Step 2 — Click Next (remove if single-step login)
    await this.waitForSelectorStatus(this.continueButtonGA, 'visible');
    await this.waitForElement(this.continueButtonGA);
    await this.clickElement(this.continueButtonGA);

    // Step 3 — Enter password
    await this.waitForSelectorStatus(this.passwordInputGA, 'hidden');
    await this.waitForSelectorStatus(this.passwordInputGA, 'visible');
    await this.waitForElement(this.passwordInputGA);
    const passwordField = this._page.locator(this.passwordInputGA);
    await passwordField.pressSequentially(password, { delay: 100 });

    // Step 4 — Submit
    await this.clickElement(this.continueButtonGA);
    await this.waitForAccessConfirmationGA();
  }

  /**
   * Logs the current user out of the application and confirms the Microsoft account to sign out.
   * Waits for the Microsoft sign-out confirmation and clears context cookies so a subsequent
   * login (e.g. with a different user in the same scenario) is not short-circuited by a
   * cached application session cookie.
   */
  async logout(): Promise<void> {
    await this.clickElement(this.profileInitials);
    await this.clickElement(this.logoutButton);
    await this.clickElement(this.logoutAccountTile);
    await this.verifyLogout();
    await this.deleteAllCookies();
  }

  /**
   * Verifies that Microsoft displays the account selector after logout.
   */
  async verifyLogout(): Promise<void> {
    await this.waitForSelectorStatus(this.accountSelectionHeading, 'visible');
    await this.waitForSelectorStatus(this.accountSelectionList, 'visible');
  }
}
