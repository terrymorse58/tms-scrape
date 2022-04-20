#!/usr/bin/env node

/**
 * scrape a single page from the command line
 *
 * Usage:
 *
 * scrape --url<source_url> --dest <destination_directory>
 *   [--config <config_file>]
 */

import { readFileSync } from 'fs';
import { doScrape } from './doscrape.js';

const DEFAULT_TIMEOUT = 300_000;

// console.log(`scrapeit argv:`, process.argv);

const args = process.argv.slice(2);

let scrapeConfig = {};

// --config (optional)
const iFlagConfig = args.indexOf('--config');
if (iFlagConfig !== -1) {
  const configPath = args[iFlagConfig + 1];
  const configJSON = readFileSync(configPath, {encoding: 'utf8'});
  let configUser = { scrapeConfig };
  configUser = JSON.parse(configJSON);
  if (!configUser.hasOwnProperty('scrapeConfig')) {
    console.error(`Error: Config file '${configPath}'` +
      ` is missing required 'scrapeConfig' parameter.`);
    process.exit(0);
  }
  scrapeConfig = configUser.scrapeConfig;
}

// --url (required)
const iFlagUrl = args.indexOf('--url');
if (iFlagUrl !== -1) {
  const url = args[iFlagUrl + 1];
  scrapeConfig.urls = [url];
}

// --dest (required)
const iFlagDest = args.indexOf('--dest');
if (iFlagDest !== -1) {
  scrapeConfig.directory = args[iFlagDest + 1];
}

if (!scrapeConfig.urls || !scrapeConfig.directory) {
  console.error('Usage: scrape ' +
    '--url <source_url> ' +
    '--dest <destination_directory> ' +
    '[--config <config_file>]');
  process.exit(0);
}

// console.log(`index.js scrapeConfig:`, scrapeConfig);

const startTime = Date.now();

const spinner = setInterval(() => {
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`  scraping ${elapsedTime}s       \r`);
}, 1000);

const timeoutID = setTimeout(() => {
  console.error(`\nscraping timed out, check '${scrapeConfig.directory}' for any output.`);
  clearTimeout(timeoutID);
  process.exit(0);
}, DEFAULT_TIMEOUT);

doScrape(scrapeConfig)
  .then(({directory, html}) => {
    clearInterval(spinner);
    clearTimeout(timeoutID);
    process.stdout.write(`\nscrape completed, results stored at '${directory}'\n`);
  })
  .catch(err => {
    console.error(`scrape error:`, err);
  });
