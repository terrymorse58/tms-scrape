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

```JSON
{
  "urls": [],
  "directory": "./site",
  "sources": [],
  "subdirectories": [],
  "maxDepth": 1,
  "removeScripts": true,
  "convertRelativeRefs": true,
  "defaultFilename": "index.html",
  "ignoreErrors": true,
  "dynamic": false,
  "puppeteerConfig": {
    "launchOptions": {
      "headless": true
    },
    "scrollToBottom": {
      "timeout": 300000,
      "viewportN": 10
    },
    "blockNavigation": true,
    "browser": null,
    "headers": {}
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
 * @return {Promise<{directory: string}>} directory containing index.html
 */

const indexDir = doScrape (config);
```
