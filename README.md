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
Which scrapes [terrymorse.com home page](https://terrymorse.com) and produces the following files:
```text
├── test
│   ├── css
│   │   ├── bootsdark.min.css
│   │   ├── bootstrap.min.css
│   │   └── css.css
│   ├── img
│   │   ├── 3744522.png
│   │   ├── abstract-business-code-270348.jpg
│   │   ├── myelevation-iphone-mockup.png
│   │   ├── simple-sender-screenshot.png
│   │   ├── tms-logo-red-transparent.png
│   │   ├── whereami-screenshot-700x1300.png
│   │   └── williams-sonoma-challenge-screenshot.png
│   └── index.html

```

## Usage

```shell
scrape --config <config_file> --url<source_url> --dest <destination_directory>
```

Where:

`config_file` - configuration file (JSON)

`source_url` - url of the page to scrape (overrides `config_file` value)

`destination_directory` - directory to contain results of scrape (overrides `config_file` value)

The `source_url` and `destination_directory` are required, specified either in the config file:

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
- saves only html, images, and css
- will not follow links

See the following for config file property details:

- [node-website-scraper](https://github.com/website-scraper/node-website-scraper#readme)
- [website-scraper-puppeteer](https://github.com/website-scraper/website-scraper-puppeteer#readme)

```JSON
{
  "urls": [],
  "directory": "./site",
  "sources": [
    {
      "selector": "img",
      "attr": "src"
    },
    {
      "selector": "link[rel=\"stylesheet\"]",
      "attr": "href"
    }
  ],
  "subdirectories": [
    {
      "directory": "img",
      "extensions": [
        ".jpg",
        ".png",
        ".svg"
      ]
    },
    {
      "directory": "css",
      "extensions": [
        ".css"
      ]
    },
    {
      "directory": "font",
      "extensions": [
        ".woff",
        ".ttf"
      ]
    }
  ],
  "maxDepth": 1,
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
A config file specified on the command line may contain any of these properties. Any property missing from the config file will use the default, above.
