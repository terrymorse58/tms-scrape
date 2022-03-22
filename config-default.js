// tms-scrape default configuration

const DEFAULT_DEST = './scrape-result',
  DEFAULT_SCROLL_TIMEOUT = 30_000,
  DEFAULT_HEADLESS = false;

const defaultConfig = {

  // urls to scrape
  urls: [],

  // destination directory
  directory: DEFAULT_DEST,

  // types of files to save (default none)
  sources: [
    // {selector: 'img', attr: 'src'},
    // {selector: 'link[rel="stylesheet"]', attr: 'href'}
  ],

  // where to store files (default none)
  subdirectories: [
    // {directory: 'img', extensions: ['.jpg', '.jpeg', '.png', '.svg']},
    // {directory: 'css', extensions: ['.css']},
    // {directory: 'font', extensions: ['.woff', '.ttf', '.woff2']}
  ],

  // how deep in hierarchy to search (1: files referenced by source file)
  maxDepth: 1,

  // convert relative refs to absolute
  convertRelativeRefs: true,

  // name for source file
  defaultFilename: 'index.html',

  // keep going if there are errors
  ignoreErrors: true,

  // dynamic: parse dynamic pages using puppeteer
  dynamic: false,

  // dynamic settings
  puppeteerConfig: {
    launchOptions: {headless: DEFAULT_HEADLESS}, // optional
    scrollToBottom: {timeout: DEFAULT_SCROLL_TIMEOUT, viewportN: 10}, // optional
    blockNavigation: true, // optional
    browser: null,
    headers: {}
  }
};

export {
  defaultConfig
};
