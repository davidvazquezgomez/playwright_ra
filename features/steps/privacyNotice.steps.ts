import { Then, When } from './fixtures';

const updatePrivacyNoticePage = 'Update Privacy Notice';
const publishedPrivacyNoticePage = 'Privacy Notice';

function verifyUpdatePrivacyNoticePage(pageName: string): asserts pageName is 'Update Privacy Notice' {
  if (pageName !== updatePrivacyNoticePage) {
    throw new Error(`Page "${pageName}" is not supported.`);
  }
}

function verifyPrivacyNoticePage(pageName: string): asserts pageName is 'Update Privacy Notice' | 'Privacy Notice' {
  if (pageName !== updatePrivacyNoticePage && pageName !== publishedPrivacyNoticePage) {
    throw new Error(`Page "${pageName}" is not supported.`);
  }
}

When(
  'add the {string} word to the end of the {string} content',
  async ({ privacyNoticePage }, word: string, pageName: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    await privacyNoticePage.appendTextToLastParagraph(word);
  },
);

Then(
  'verify the {string} content is modified with the {string} word added to the end',
  async ({ privacyNoticePage }, pageName: string, word: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    await privacyNoticePage.verifyLastParagraphEndsWith(word);
  },
);

Then(
  'verify the {string} content contains the {string} word added to the end',
  async ({ privacyNoticePage }, pageName: string, word: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    await privacyNoticePage.verifyLastParagraphEndsWith(word);
  },
);

Then(
  'verify the {string} content does not contain the {string} word added to the end',
  async ({ privacyNoticePage }, pageName: string, word: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    await privacyNoticePage.verifyLastParagraphDoesNotEndWith(word);
  },
);

When(
  'remove the {string} word from the end of the {string} content',
  async ({ privacyNoticePage }, word: string, pageName: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    await privacyNoticePage.removeTextFromLastParagraph(word);
  },
);

Then(
  'save the first paragraph of the {string} content',
  async ({ privacyNoticePage, testData }, pageName: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    testData.privacyNoticeFirstParagraph = await privacyNoticePage.getPrivacyNoticeParagraph(pageName, 'first');
  },
);

Then(
  'save the last paragraph of the {string} content',
  async ({ privacyNoticePage, testData }, pageName: string) => {
    verifyUpdatePrivacyNoticePage(pageName);
    testData.privacyNoticeLastParagraph = await privacyNoticePage.getPrivacyNoticeParagraph(pageName, 'last');
  },
);

Then(
  'verify the first paragraph of the {string} content matches the saved first paragraph of the {string} content',
  async ({ privacyNoticePage, testData }, actualPageName: string, savedPageName: string) => {
    verifyPrivacyNoticePage(actualPageName);
    verifyUpdatePrivacyNoticePage(savedPageName);

    const savedParagraph = testData.privacyNoticeFirstParagraph;
    if (typeof savedParagraph !== 'string') {
      throw new Error('No saved first paragraph exists for the Update Privacy Notice content.');
    }

    const actualParagraph = await privacyNoticePage.getPrivacyNoticeParagraph(actualPageName, 'first');
    if (actualParagraph !== savedParagraph) {
      throw new Error('The first Privacy Notice paragraph does not match the saved Update Privacy Notice paragraph.');
    }
  },
);

Then(
  'verify the last paragraph of the {string} content matches the saved last paragraph of the {string} content',
  async ({ privacyNoticePage, testData }, actualPageName: string, savedPageName: string) => {
    verifyPrivacyNoticePage(actualPageName);
    verifyUpdatePrivacyNoticePage(savedPageName);

    const savedParagraph = testData.privacyNoticeLastParagraph;
    if (typeof savedParagraph !== 'string') {
      throw new Error('No saved last paragraph exists for the Update Privacy Notice content.');
    }

    const actualParagraph = await privacyNoticePage.getPrivacyNoticeParagraph(actualPageName, 'last');
    if (actualParagraph !== savedParagraph) {
      throw new Error('The last Privacy Notice paragraph does not match the saved Update Privacy Notice paragraph.');
    }
  },
);