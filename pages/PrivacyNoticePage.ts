import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PrivacyNoticePage extends BasePage {
  private privacyNoticeEditor = 'kendo-editor[formcontrolname="globalPrivacyNotice"] .ProseMirror';
  private lastPrivacyNoticeParagraph = `${this.privacyNoticeEditor} > p:last-of-type`;
  private firstPrivacyNoticeParagraph = `${this.privacyNoticeEditor} > p:first-of-type`;
  private privacyNoticeContentTitle = 'Global RegulatoryAdvantage Privacy Notice';

  /**
   * Appends text to the final paragraph of the editable privacy notice.
   * @param text Text to append.
   */
  async appendTextToLastParagraph(text: string): Promise<void> {
    const editor = this._page.locator(this.privacyNoticeEditor);
    const lastParagraph = this._page.locator(this.lastPrivacyNoticeParagraph);

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
    const lastParagraph = this._page.locator(this.lastPrivacyNoticeParagraph);
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
    const lastParagraph = this._page.locator(this.lastPrivacyNoticeParagraph);
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
    const lastParagraph = this._page.locator(this.lastPrivacyNoticeParagraph);
    await expect(lastParagraph).toBeVisible();
    const paragraphText = (await lastParagraph.textContent())?.trim();

    expect(paragraphText, 'Expected the final privacy-notice paragraph to contain text.').toBeTruthy();
    if (new RegExp(`${this.escapeForRegExp(text)}$`).test(paragraphText!)) {
      this.failWithApplicationError(
        'The final Privacy Notice paragraph must not retain removed text.',
        `Text that does not end with "${text}".`,
        paragraphText!,
        'The final Privacy Notice paragraph was displayed and read successfully.',
      );
    }
  }

  /**
   * Removes the final word from the editable privacy-notice paragraph.
   * @param text Text expected to be the final word before removal.
   */
  async removeTextFromLastParagraph(text: string): Promise<void> {
    await this.verifyLastParagraphEndsWith(text);

    const editor = this._page.locator(this.privacyNoticeEditor);
    await editor.focus();
    await editor.press('Control+End');
    await editor.press('Control+Shift+ArrowLeft');
    await editor.press('Backspace');
  }

  private getPrivacyNoticeParagraphLocator(
    pageName: 'Update Privacy Notice' | 'Privacy Notice',
    position: 'first' | 'last',
  ) {
    if (pageName === 'Update Privacy Notice') {
      return this._page.locator(
        position === 'first' ? this.firstPrivacyNoticeParagraph : this.lastPrivacyNoticeParagraph,
      );
    }

    const publishedContent = this._page
      .getByRole('heading', { name: this.privacyNoticeContentTitle, exact: true })
      .locator('..');
    const publishedParagraphs = publishedContent.locator(':scope > p');
    return position === 'first' ? publishedParagraphs.first() : publishedParagraphs.last();
  }

  private normalizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private escapeForRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}