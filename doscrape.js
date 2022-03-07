// scrape a single URL and store results locally

import scrape from 'website-scraper';
import { existsSync, rmdirSync } from 'fs';

/**
 * scrape a single page
 * @param {Object} options
 * @return {Promise<{directory: string}>}
 */
function doScrape (options) {

  const {directory} = options;

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

      return scrape(options);
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
