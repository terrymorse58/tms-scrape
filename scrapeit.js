#!/usr/bin/env node

// scrape a single page
// Usage: scrapeit url [destination_directory] [--headless]

const DEFAULT_DEST = './sites',
  DEFAULT_TIMEOUT = 60_000,
  DEFAULT_HEADLESS = false;

import { doScrape } from './doscrape.js';

// console.log(`scrapeit argv:`, process.argv);

if (process.argv.length < 3) {
  console.error('Error: not enough command line arguments')
  console.error("Usage: scrapeit url [destination_directory] [--headless]");
  process.exit(0);
}

const args = process.argv.slice(2);
const argVals = args.filter(arg => !arg.startsWith('--'));
const argMods = args.filter(arg => arg.startsWith('--'));

// console.log('argVals:', argVals);
// console.log('arvMods:', argMods);

const url = argVals[0],
  destRoot = (argVals.length > 1) ? argVals[1] : DEFAULT_DEST;

// get headless setting
const headless = argMods.includes('--headless') || DEFAULT_HEADLESS;

process.stdout.write(`scrapeit details:
  url: ${url}
  destination directory: ${destRoot}
  headless: ${headless ? 'TRUE' : 'FALSE'}\n`);

// process.exit(0);

const startTime = Date.now();

const spinner = setInterval(() => {
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`  scraping ${elapsedTime}s       \r`);
}, 1000);

const timeoutID = setTimeout(() => {
  console.error(`\nscraping timed out, check ${destRoot} for any output.`);
  clearTimeout(timeoutID);
  process.exit(0);
}, DEFAULT_TIMEOUT);

doScrape(url, destRoot, {headless})
  .then(({directory}) => {
    clearInterval(spinner);
    clearTimeout(timeoutID);
    process.stdout.write(`\nscraping results stored at ${directory}.\n`);
  })
  .catch(err => {
    console.error(`scrape error:`, err);
  });
