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
 */

import scrape from 'website-scraper';
import { readFileSync } from 'fs';

/**
 * scrape a single page using 'website-scraper'
 * @param {WsScraperOptions} options
 * @returns {Promise<string>} html
 */
function websiteScraper (options) {

  const {directory} = options,
    htmlPath = directory +
      (directory.slice(-1) !== '/' ? '/index.html' : 'index.html');

  console.log(`websiteScraper:
    directory: ${directory}
    htmlPath: ${htmlPath}`);

  return new Promise(resolve => resolve())

    .then(() => {
      return setTimeout(() => {
        throw `scrape timed out`;
      }, 15_000);
    })

    .then(timeoutID => {
      scrape(options);
      // read the html file, return the html text
      clearTimeout(timeoutID);
      return readFileSync(htmlPath, {encoding: 'utf8'});
    })

    .catch(err => {
      console.error(`websiteScraper Error:`, err);
      console.log(`websiteScraper error, returning generic error page`);
      return  `
<html lang="en"><head><title>Error Occurred</title></head>
<body>
<div id="readuce-error">
  <h1>Readuce Error</h1>
  <p>An error occured while trying to communicate with ${directory}.</p>
</div>
</body>
</html>      
      `;
    });
}

export {
  websiteScraper
}
