// scrape a site using website-scraper

import scrape from 'website-scraper';
import { readFileSync } from 'fs';

/**
 * scrape a single page using 'website-scraper'
 * @param {Object} options
 * @returns {Promise<string>} html
 */
function websiteScraper (options) {

  const {directory} = options;

  return new Promise(resolve => resolve())

    .then(() => {
      return scrape(options);
    })

    .then(() => {
      // read the html file, return the html text
      const htmlPath = directory +
        (directory.slice(-1) !== '/' ? '/index.html' : 'index.html')
      return readFileSync(htmlPath, {encoding: 'utf8'});
    })

    .catch(err => {
      console.error(`websiteScraper Error:`, err);
    });
}

export {
  websiteScraper
}
