// curlexec - an attempt to use curl to retrieve a web page
// ref: https://stackoverflow.com/a/27190062/3113485

import { exec } from 'child_process';

/**
 * use curl to scrape the contents of a document
 * @param url
 * @return {Promise<string>} - contents of the document
 */
function curlScrape (url) {
  // console.log('curlScrape url:', url);

  return new Promise((resolve, reject) => {

    exec(
      `curl ${url}`,
      function (err, stdout, stderr) {

        if (err) {
          console.error(`curlScrape err:`, err);
          reject(err);
        }

        // console.log(`curlScrape ${url} success`);
        resolve(stdout);
      }
    );

  });
}

export { curlScrape };
