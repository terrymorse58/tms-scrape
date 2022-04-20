# tms-scrape

scrape a single web page from the command line
---

## Install

```shell
npm install [-g] tms-scrape
```

## Test

```shell
npm run test
```
Which scrapes [terrymorse.com home page](https://terrymorse.com) and produces the following file:
```text
test
└── index.html
```

## Usage

```shell
scrape --url <source_url>  [--config <config_file> --dest <directory>]
```

Where:

- `source_url` - url of the page to scrape (overrides `config_file` value)
- `config_file` - configuration file (JSON)
- `directory` - directory to contain results of scrape (overrides `config_file` value)

The `source_url` is required, specified either in the config file:

```json
{
  "urls": [
    "https://terrymorse.com"
  ],
  "directory": "test"
}
```
or on the command line.

### Config File Default Properties

A default scraping does the following:

- evaluates static page
- saves only html
- will not follow links
- removes all scripts from HTML file
- converts all relative URLs to absolute

See the following for config file property details:

- [node-website-scraper](https://github.com/website-scraper/node-website-scraper#readme)
- [website-scraper-puppeteer](https://github.com/website-scraper/website-scraper-puppeteer#readme)

```javascript
const configDefault = {
  // urls to scrape (required)
  "urls": [],

  // destination directory
  "directory": "./scrape-result",

  // scrape using axios instead of 'website-scraper'
  "scrapeWithAxios": false,

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
}
```
A config file specified on the command line may contain any of these properties. Any property missing from the config file will use the default (above).

## API

```javascript
import { doScrape } from 'tms-scrape';
/**
 * scrape a single page
 * @param {Object} options
 * @return {Promise<{directory: string, html: string}>}
 */

const {directory, html} = doScrape (options);
```
