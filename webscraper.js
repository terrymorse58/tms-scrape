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
      return setTimeout(() => {
        throw `scrape timed out`;
      }, 15_000);
    })

    .then(timeoutID => {
      scrape(options);
      // read the html file, return the html text
      clearTimeout(timeoutID);
      const htmlPath = directory +
        (directory.slice(-1) !== '/' ? '/index.html' : 'index.html')
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
