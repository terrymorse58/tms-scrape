// tms-scrape default configuration

const DEFAULT_DEST = './scrape-result',
  DEFAULT_SCROLL_TIMEOUT = 30_000,
  DEFAULT_HEADLESS = false;

const defaultConfig = {

  // urls to scrape
  "urls": [],

  // destination directory
  "directory": "./scrape-result",

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

  // convert relative refs to absolute
  "convertRelativeRefs": true,

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
