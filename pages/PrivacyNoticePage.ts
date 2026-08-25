import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PrivacyNoticePage extends BasePage {
  private privacyNoticeEditor = 'kendo-editor[formcontrolname="globalPrivacyNotice"] .ProseMirror';
  private privacyNoticeParagraphs = `${this.privacyNoticeEditor} > p`;
  private firstPrivacyNoticeParagraph = `${this.privacyNoticeEditor} > p:first-of-type`;
  private privacyNoticeContentTitle = 'Global RegulatoryAdvantage Privacy Notice';
  private privacyNoticeLinkByName = (linkName: string) =>
    this._page.getByRole('link', { name: linkName, exact: true });
  private lastClickedLinkDestination: string | undefined;

  private async getPublishedLink(linkName: string) {
    const exactLink = this.privacyNoticeLinkByName(linkName);
    if (await exactLink.count() > 0) {
      return exactLink;
    }

    const linkNameWithoutTrailingPunctuation = linkName.replace(/[.,;:!?]+$/, '');
    return this.privacyNoticeLinkByName(linkNameWithoutTrailingPunctuation);
  }

  /**
   * Verifies that a named link is visible in the published privacy notice.
   * @param linkName Accessible name of the expected link.
   */
  async verifyPublishedLinkDisplayed(linkName: string): Promise<void> {
    await expect(await this.getPublishedLink(linkName)).toBeVisible();
  }

  /**
   * Opens a published privacy-notice link and retains its declared destination.
   * External links opened in a new tab are brought into the page object context.
   * @param linkName Accessible name of the link to open.
   */
  async clickPublishedLink(linkName: string): Promise<void> {
    const link = await this.getPublishedLink(linkName);
    await expect(link).toBeVisible();

    const destination = await link.getAttribute('href');
    if (!destination) {
      throw new Error(`Privacy Notice link "${linkName}" does not declare a destination.`);
    }

    this.lastClickedLinkDestination = destination;
    const opensNewTab = (await link.getAttribute('target')) === '_blank';

    if (opensNewTab) {
      const popupPromise = this._page.waitForEvent('popup');
      await link.click();
      this._page = await popupPromise;
      await this._page.waitForLoadState('domcontentloaded').catch(() => undefined);
      return;
    }

    await link.click();
  }

  /**
   * Verifies that the destination declared by the last clicked link was opened.
   * Mail links are validated against their declared href because no browser page
   * is created for an external mail client.
   * @param expectedDestination Expected href from the feature example.
   */
  async verifyLastClickedLinkDestination(expectedDestination: string): Promise<void> {
    if (this.lastClickedLinkDestination !== expectedDestination) {
      throw new Error(
        `Expected Privacy Notice destination "${expectedDestination}", ` +
        `but the link declared "${this.lastClickedLinkDestination ?? 'none'}".`,
      );
    }

    if (expectedDestination.startsWith('mailto:')) {
      return;
    }

    await expect(this._page).toHaveURL(expectedDestination);
  }

  /**
   * Appends text to the final paragraph of the editable privacy notice.
   * @param text Text to append.
   */
  async appendTextToLastParagraph(text: string): Promise<void> {
    const editor = this._page.locator(this.privacyNoticeEditor);
    const lastParagraph = this.getLastPrivacyNoticeParagraph();

    await expect(lastParagraph).toBeVisible();
    await editor.focus();
    await editor.press('Control+End');
    await editor.pressSequentially(` ${text}`);
  }

  /**
   * Verifies that the final privacy-notice paragraph ends with the requested text.
   * @param text Text expected at the end of the final paragraph.
   */
  async verifyLastParagraphEndsWith(text: string): Promise<void> {
    const lastParagraph = this.getLastPrivacyNoticeParagraph();
    await expect(lastParagraph).toBeVisible();
    const paragraphText = (await lastParagraph.textContent())?.trim();

    expect(paragraphText, 'Expected the final privacy-notice paragraph to contain text.').toBeTruthy();
    if (!new RegExp(`${this.escapeForRegExp(text)}$`).test(paragraphText!)) {
      this.failWithApplicationError(
        'The final Privacy Notice paragraph must retain the requested ending text.',
        `Text ending with "${text}".`,
        paragraphText!,
        'The final Privacy Notice paragraph was displayed and read successfully.',
      );
    }
  }

  /**
   * Returns the final word in the editable privacy-notice content.
   * @returns The final word in the final paragraph.
   */
  async getLastContentWord(): Promise<string> {
    const lastParagraph = this.getLastPrivacyNoticeParagraph();
    await expect(lastParagraph).toBeVisible();
    await expect.poll(
      async () => (await lastParagraph.textContent())?.trim() ?? '',
      { message: 'Expected the final privacy-notice paragraph to load content.' },
    ).not.toBe('');

    const paragraphText = (await lastParagraph.textContent())!.trim();

    const words = paragraphText.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (!lastWord) {
      throw new Error('Unable to determine the final privacy-notice word.');
    }

    return lastWord;
  }

  /**
   * Returns a requested paragraph from the editable or published privacy notice.
   * @param pageName Name of the privacy notice page that owns the paragraph.
   * @param position Requested paragraph position.
   * @returns Normalized paragraph text.
   */
  async getPrivacyNoticeParagraph(
    pageName: 'Update Privacy Notice' | 'Privacy Notice',
    position: 'first' | 'last',
  ): Promise<string> {
    const paragraph = this.getPrivacyNoticeParagraphLocator(pageName, position);
    await expect(paragraph).toBeVisible();
    await expect.poll(
      async () => this.normalizeText((await paragraph.textContent()) ?? ''),
      { message: `Expected the ${position} paragraph on ${pageName} to load content.` },
    ).not.toBe('');

    return this.normalizeText((await paragraph.textContent()) ?? '');
  }

  /**
   * Verifies that the final privacy-notice paragraph does not end with the requested text.
   * @param text Text not expected at the end of the final paragraph.
   */
  async verifyLastParagraphDoesNotEndWith(text: string): Promise<void> {
    const lastParagraph = this.getLastPrivacyNoticeParagraph();
    await expect(lastParagraph).toBeVisible();
    const trailingTextPattern = new RegExp(`${this.escapeForRegExp(text)}$`);

    await expect.poll(
      async () => {
        const paragraphText = (await lastParagraph.textContent())?.trim() ?? '';
        return paragraphText.length > 0 && !trailingTextPattern.test(paragraphText);
      },
      { message: 'Expected the final privacy-notice paragraph to contain text.' },
    ).toBe(true);
  }

  /**
   * Removes the final word from the editable privacy-notice paragraph.
   * @param text Text expected to be the final word before removal.
   */
  async removeTextFromLastParagraph(text: string): Promise<void> {
    await this.verifyLastParagraphEndsWith(text);

    const editor = this._page.locator(this.privacyNoticeEditor);
    const lastParagraph = this.getLastPrivacyNoticeParagraph();
    const paragraphText = (await lastParagraph.textContent())?.trim() ?? '';
    const trailingTextPattern = new RegExp(`(?:^|\\s)${this.escapeForRegExp(text)}$`);
    let remainingOccurrences = 0;
    let textToInspect = paragraphText;

    while (trailingTextPattern.test(textToInspect)) {
      remainingOccurrences += 1;
      textToInspect = textToInspect.slice(0, textToInspect.lastIndexOf(text)).trimEnd();
    }

    await editor.focus();
    for (let occurrence = 0; occurrence < remainingOccurrences; occurrence += 1) {
      await editor.press('Control+End');
      await editor.press('Control+Shift+ArrowLeft');
      await editor.press('Backspace');
    }
  }

  /**
   * Removes the final text when it is present at the end of the editable privacy notice.
   * @param text Text to remove when it is the final word.
   * @returns True when the content was changed.
   */
  async removeTextFromLastParagraphIfPresent(text: string): Promise<boolean> {
    const lastParagraph = this.getLastPrivacyNoticeParagraph();
    const paragraphText = (await lastParagraph.textContent())?.trim() ?? '';
    const trailingTextPattern = new RegExp(`${this.escapeForRegExp(text)}$`);

    if (!trailingTextPattern.test(paragraphText)) {
      return false;
    }

    await this.removeTextFromLastParagraph(text);
    return true;
  }

  private getPrivacyNoticeParagraphLocator(
    pageName: 'Update Privacy Notice' | 'Privacy Notice',
    position: 'first' | 'last',
  ) {
    if (pageName === 'Update Privacy Notice') {
      return position === 'first'
        ? this._page.locator(this.firstPrivacyNoticeParagraph)
        : this.getLastPrivacyNoticeParagraph();
    }

    const publishedContent = this._page
      .getByRole('heading', { name: this.privacyNoticeContentTitle, exact: true })
      .locator('..');
    const publishedParagraphs = publishedContent.locator(':scope > p');
    return position === 'first' ? publishedParagraphs.first() : publishedParagraphs.last();
  }

  private getLastPrivacyNoticeParagraph() {
    return this._page.locator(this.privacyNoticeParagraphs).filter({ hasText: /\S/ }).last();
  }

  private normalizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private escapeForRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}