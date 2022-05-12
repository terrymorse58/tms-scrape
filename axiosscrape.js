// scrape a single file using axios

import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * scrape a single file using axios
 * @param {Object} options
 * @returns {Promise<string>} html text
 */
function axiosScrape (options) {
  console.log(`axiosScrape()`);

  const [urlString] = options.urls;

  console.log(`  axiosScrape url: ${urlString}`);

  return axios.get(urlString, {timeout: 15_000})

    .then(res => {

      console.log(`   axiosScrape axios.get completed without error`);

      const {data} = res;

      return String(data);
    })

    .catch(err => {
      console.error(`  axiosScrape Error:`, err);
      console.log(`An error occured in axios.get, returning generic error message`);
      return `
<html><head><title>Error Occurred</title></head>
<body>
<div id="readuce-error">
  <h1>Readuce Error</h1>
  <p>An error occured while trying to communicate with ${urlString}.</p>
</div>
</body>
`;
    });
}

export { axiosScrape };
