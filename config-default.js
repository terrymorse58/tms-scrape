// tms-scrape default configuration

const defaultConfig = {

  // urls to scrape (required)
  "urls": [],

  // destination directory
  "directory": "./scrape-result",

  // scrape using axios
  "scrapeWithAxios": false,

  "httpHeaders": null,

  // some headers to try for fussy hosts (edit 'www.example.com')
  // "httpHeaders": {
  //   "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
  //   "Cache-Control": "no-cache",
  //   "Host": "www.example.com"
  // },

  // scrape using curl
  "scrapeWithCurl": false,

  // types of files to save (default none)
  "sources": [
    // {selector: 'img', attr: 'src'},
    // {selector: 'link[rel="stylesheet"]', attr: 'href'}
  ],

  // where to store files (default none)
  "subdirectories": [
    // {directory: 'img', extensions: ['.jpg', '.jpeg', '.png', '.svg']},
    // {directory: 'css', extensions: ['.css']},
    // {directory: 'font', extensions: ['.woff', '.ttf', '.woff2']}
  ],

  // how deep in hierarchy to search (1: files referenced by source file)
  "maxDepth": 1,

  // remove all link elements
  "removeLinkEls": true,

  // remove all style elements
  "removeStyles": true,

  // remove all scripts from HTML file
  "removeScripts": true,

  // convert relative refs to absolute
  "convertRelativeRefs": true,

  // save html to file
  "saveToFile": true,

  // name for source file
  "defaultFilename": 'index.html',

  // keep going if there are errors
  "ignoreErrors": true,

  // dynamic: parse dynamic pages using puppeteer
  "dynamic": false,

  // dynamic settings
  "puppeteerConfig": {
    // "launchOptions": {"headless": false},
    // "scrollToBottom": {"timeout": 30_000, "viewportN": 10},
    // "blockNavigation": true,
    // "browser": null,
    // "headers": {}
  }
};

export {
  defaultConfig
};
