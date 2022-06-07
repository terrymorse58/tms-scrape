// scrape a site using website-scraper

/**
 * @typedef {Object} WsScraperOptions
 * @property {String[]} urls
 * @property {String} directory
 * @property {{selector: string, attr: string}[]} sources
 * @property {Boolean} recursive
 * @property {Number|null} maxRecursiveDepth
 * @property {Number|null} maxDepth
 * @property {Object} request
 * @property {{directory: string, extensions: Array<string>}} subdirectories
 * @property {String} defaultFilename
 * @property {Boolean} prettifyUrls
 * @property {Boolean} ignoreErrors
 * @property {Function} urlFilter
 * @property {String} filenameGenerator
 * @property {Number} requestConcurrency
 * @property {[]} plugins
 * @property {Boolean} [debug]
 */

import scrape from 'website-scraper';
import { readFileSync } from 'fs';

/**
 * scrape a single page using 'website-scraper'
 * @param {WsScraperOptions} options
 * @returns {Promise<string>} html
 */
function websiteScraper (options) {

  const {directory, debug} = options,
    htmlPath = directory +
      (directory.slice(-1) !== '/' ? '/index.html' : 'index.html');
  let timeoutID;

  if (debug) {
    console.log(`websiteScraper:
    directory: ${directory}
    htmlPath: ${htmlPath}`);
  }

  return new Promise(resolve => resolve())

    .then(() => {
      timeoutID = setTimeout(() => {
        throw `scrape timed out`;
      }, 15_000);
    })

    .then(() => {

      if (debug) {
        console.log(`  websiteScraper calling scrape with options:`, options);
      }

      return scrape(options);
    })

    .then(scrapeResult => {

      const saved = scrapeResult[0]?.saved;

      if (debug) {
        console.log(
          `  websiteScraper scrape scrapeResult.saved = ${saved ? 'TRUE' : 'FALSE'}`);
      }

      // read the html file, return the html text
      clearTimeout(timeoutID);

      if (!saved) {
        throw `website-scraper did not save the file`;
      }

      if (debug) {
        console.log(`  website-scraper saved results to '${htmlPath}'`);
      }

      return readFileSync(htmlPath, {encoding: 'utf8'});
    })

    .catch(err => {
      console.error(`websiteScraper Error:`, err);

      if (debug) {
        console.log(`websiteScraper error, returning generic error page`);
      }

      return (
`<html lang="en"><head><title>Error Occurred</title></head>
<body>
<div id="readuce-error">
  <h1>Readuce Error</h1>
  <p>An error occured while trying to communicate with ${directory}.</p>
  <p>Error message: ${err.message || JSON.stringify(err)}</p>
</div>
</body>
</html>`);

    });
}

export {
  websiteScraper
};
