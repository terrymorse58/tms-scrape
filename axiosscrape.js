// scrape a single file using axios

import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * scrape a single file using axios
 * @param {Object} options
 * @returns {Promise<any>}
 */
function axiosScrape (options) {
  // console.log(`axiosScrape()`);

  const [urlStr] = options.urls;
  const {directory, defaultFileName} = options;
  const writePath = directory +
    ((directory.slice(-1) !== '/') ? '/' : '') +
    (defaultFileName || 'index.html');

  const startTime = Date.now();
  return axios.get(urlStr)
    .then(res => {
      const {data, status, statusText} = res;
      const elaspedTime = ((Date.now() - startTime) / 1000).toFixed(2);

      // console.log(`  axiosScrape status: ${status}, statusText: ${statusText}`);
      // console.log(`    data.length: ${data.length}`);
      // console.log(`  axiosScrape complete in ${elaspedTime} secs`);

      const mdResult = mkdirSync(directory, {
        recursive: true,
        mode: 0o755
      });

      // console.log(`  axiosScrape mdResult: ${mdResult}`);

      writeFileSync(writePath, data, {encoding: 'utf8'});
    })
    .catch(err => {
      console.error(`  axiosScrape Error:`, err);
    });
}

export { axiosScrape };
