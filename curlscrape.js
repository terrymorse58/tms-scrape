// curlexec - an attempt to use curl to retrieve a web page
// ref: https://stackoverflow.com/a/27190062/3113485

import { exec } from 'child_process';

/*
  TODO allow the use of httpHeaders config to send custom headers

  Example:

    curl --header "X-First-Name: Joe" http://example.com/
*/

/**
 * use curl to scrape the contents of a document
 * @param url
 * @param {string} [cookie]
 * @param {Boolean} [debug]
 * @return {Promise<string>} - contents of the document
 */
function curlScrape (url, {
  cookie = undefined,
  debug = false
}) {

  if (debug) {
    console.log(`curlScrape url: ${url}, cookie: ${cookie}`);
  }

  return new Promise((resolve, reject) => {

    let command = `curl ${url}`;
    if (cookie) {
      command += ` --cookie "${cookie}"`;
    }

    if (debug) {
      console.log(`  curlScrape command: '${command}'`);
    }

    exec(
      command,
      function (err, stdout, stderr) {

        if (err) {
          console.error(`curlScrape err:`, err);
          reject(err);
        }

        if (debug) {
          console.log(`  curlScrape ${url} success`);
        }

        resolve(stdout);
      }
    );

  });
}

export { curlScrape };
