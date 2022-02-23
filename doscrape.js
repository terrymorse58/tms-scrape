// scrape a single URL and store results locally

import scrape from 'website-scraper';
import PuppeteerPlugin from 'website-scraper-puppeteer';
import { existsSync, rmdirSync } from 'fs';

/**
 * scrape a single page
 * @param {String} url
 * @param {String} destRoot
 * @param {Boolean} [headless]
 * @return {Promise<{directory: string}>}
 */
function doScrape (url, destRoot, {headless= false}) {

  const urls = [url];
  let directory = destRoot + '/' +
    url.replace(/^http(.*):\/\//, '');

  // strip html file from directory, if it exists
  if (directory.endsWith('.html')) {
    const dirSegments = directory.split('/');
    dirSegments.pop();
    directory = dirSegments.join('/');
  }
  // console.log(`saving to directory: ${directory}`);

  return new Promise(resolve => resolve())

    .then(() => {
      // delete target directory if it exists
      if (!existsSync(directory)) { return; }

      // console.log(`removing existing directory: ${directory}`);
      return rmdirSync(directory, {
        maxRetries: 5,
        recursive: true
      });
    })

    .then(() => {

      return scrape({
        urls,
        directory,
        plugins: [
          new PuppeteerPlugin({
            launchOptions: {headless}, /* optional */
            scrollToBottom: {timeout: 10_000, viewportN: 10}, /* optional */
            blockNavigation: true, /* optional */
          })
        ]
      });
    })

    .then(() => {
      return {
        directory
      };
    });

}

export {
  doScrape
};
