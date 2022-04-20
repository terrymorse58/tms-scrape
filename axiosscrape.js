// scrape a single file using axios

import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * scrape a single file using axios
 * @param {Object} options
 * @returns {Promise<string>} html text
 */
function axiosScrape (options) {
  // console.log(`axiosScrape()`);

  const [urlString] = options.urls;

  return axios.get(urlString)

    .then(res => {
      const {data} = res;

      return String(data);
    })

    .catch(err => {
      console.error(`  axiosScrape Error:`, err);
    });
}

export { axiosScrape };
