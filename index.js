#!/usr/bin/env node

// scrape a single page
// Usage: scrape --url<source_url> --dest <destination_directory> [--config <config_file>]

import PuppeteerPlugin from 'website-scraper-puppeteer';
import { readFileSync } from 'fs';
import { doScrape } from './doscrape.js';


const DEFAULT_DEST = './site',
  DEFAULT_TIMEOUT = 300_000,
  DEFAULT_HEADLESS = false;

let config = {

  // urls to scrape
  urls: [],

  // destination directory
  directory: DEFAULT_DEST,

  // types of files to save
  sources: [
    // {selector: 'img', attr: 'src'},
    // {selector: 'link[rel="stylesheet"]', attr: 'href'}
  ],

  // where to store files
  subdirectories: [
    // {directory: 'img', extensions: ['.jpg', '.jpeg', '.png', '.svg']},
    // {directory: 'css', extensions: ['.css']},
    // {directory: 'font', extensions: ['.woff', '.ttf', '.woff2']}
  ],

  // how deep in hierarchy to search (1: files referenced by source file)
  maxDepth: 1,

  // default name for source file
  defaultFilename: 'index.html',

  // keep going if there are errors
  ignoreErrors: true,

  // dynamic: parse dynamic pages using puppeteer
  dynamic: false,
  puppeteerConfig: {
    launchOptions: {headless: DEFAULT_HEADLESS}, // optional
     scrollToBottom: {timeout: DEFAULT_TIMEOUT, viewportN: 10}, // optional
    blockNavigation: true, // optional
    browser: null,
    headers: {}
  }
};


// console.log(`scrapeit argv:`, process.argv);

const args = process.argv.slice(2);

const iFlagConfig = args.indexOf('--config');
if (iFlagConfig !== -1) {
  const configPath = args[iFlagConfig + 1];
  const configJSON = readFileSync(configPath, {encoding: 'utf8'});
  const confUser = JSON.parse(configJSON);
  config = Object.assign(config, confUser);
}

const iFlagUrl = args.indexOf('--url');
if (iFlagUrl !== -1) {
  const url = args[iFlagUrl + 1];
  config.urls = [url];
}

const iFlagDest = args.indexOf('--dest');
if (iFlagDest !== -1) {
  config.directory = args[iFlagDest + 1];
}

if (!config.urls.length || !config.directory) {
  console.error('Usage: scrape ' +
    '--url <source_url> ' +
    '--dest <destination_directory> ' +
    '[--config <config_file>]');
  process.exit(0);
}


if (config.dynamic) {
  const plugin = new PuppeteerPlugin(config.puppeteerConfig);
  config.plugins = [plugin];
}

process.stdout.write(
`  source: ${config.urls}
  destination: ${config.directory}\n`
);

const startTime = Date.now();

const spinner = setInterval(() => {
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`  scraping ${elapsedTime}s       \r`);
}, 1000);

const timeoutID = setTimeout(() => {
  console.error(`\nscraping timed out, check '${config.directory}' for any output.`);
  clearTimeout(timeoutID);
  process.exit(0);
}, DEFAULT_TIMEOUT);

doScrape(config)
  .then(({directory}) => {
    clearInterval(spinner);
    clearTimeout(timeoutID);
    process.stdout.write(`\nscrape completed, results stored at '${directory}'\n`);
  })
  .catch(err => {
    console.error(`scrape error:`, err);
  });
