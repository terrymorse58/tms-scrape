// scrape a single URL and store results locally

import { existsSync, rmSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { axiosScrape } from './axiosscrape.js';
import { websiteScraper } from './webscraper.js';
import { defaultConfig } from './config-default.js';
import PuppeteerPlugin from 'website-scraper-puppeteer';
import { curlScrape } from './curlscrape.js';

/**
 * get url info of the source file
 * @param urlStr
 * @return {URL}
 */
function getURLInfo (urlStr) {
  const myUrl = new URL(urlStr);
  const {href, protocol, host, port, origin, pathname, hash, search} = myUrl;
  return {
    href,
    protocol,
    host,
    port,
    origin,
    pathname,
    hash,
    search
  };
}

// read HTML file into document
function readHtmlFile (path) {
  const htmlStr = readFileSync(path, {
    encoding: 'utf8'
  });
  const dom = new JSDOM(htmlStr);
  return dom.window.document;
}

/**
 * add URL info to head as meta elements
 * @param {HTMLDocument} document
 * @param {URL} info
 */
function insertURLInfo (document, info) {
  const head = document.head;
  for (const [name, value] of Object.entries(info)) {
    const tab = document.createTextNode('  ');
    head.appendChild(tab);
    const meta = document.createElement('meta');
    meta.name = `url:${name}`;
    meta.content = value;
    head.appendChild(meta);
    const newline = document.createTextNode('\n');
    head.appendChild(newline);
  }
}

/**
 * get elements that have an attribute with a relative reference URL
 * @param {HTMLDocument} document
 * @param {String} attrName
 * @return {HTMLElement[]}
 */
function elementsWithRelativeRefs (document, attrName) {
  return [...document.querySelectorAll(`[${attrName}]`)]
    .filter(el => {
      return !(
        !el[attrName] ||
        el[attrName].length === 0 ||
        el[attrName].startsWith('http') ||
        el[attrName].startsWith('//') ||
        el[attrName].startsWith('data:')
      );
    });
}

/**
 * convert all element relative references to absolute
 * @param {HTMLDocument} document
 * @param {URL} info
 */
function relativeRefsToAbsolute (document, info) {

  let path = info.pathname;
  let segments = path.split('/');
  if (segments[segments.length - 1].includes('.')) {
    segments.pop();
  }
  path = segments.join('/');
  if (!path.endsWith('/')) { path = path + '/'; }

  // elements with relative src attributes
  const srcEls = elementsWithRelativeRefs(document, 'src');
  srcEls.forEach(el => {
    el.src = new URL(el.src, info.origin + path).href;
  });

  // elements with relative href attributes
  const hrefEls = elementsWithRelativeRefs(document, 'href');
  hrefEls.forEach(el => {
    el.href = new URL(el.href, info.origin + path).href;
  });
}

/**
 * remove all scripts from document
 * @param {HTMLDocument} document
 */
function removeAllScripts (document) {
  const scripts = [...document.querySelectorAll('script')];
  scripts.forEach(script => {
    script.remove();
  });
}

let startTime, elapsedTime;

function startTimer () {
  startTime = Date.now();
}

/**
 * get elapsed time and reset timer
 * @return {number} seconds
 */
function getElapsedTime () {
  const now = Date.now();
  elapsedTime = ((now - startTime) / 1000).toFixed(3);
  startTimer();
  return Number(elapsedTime);
}

/**
 * create a complete scrape options configuration
 * @param {Object} options
 * @returns {Object}
 */
function setConfig (options) {
  let config = Object.assign({}, defaultConfig);
  config = Object.assign(config, options);
  if (config.dynamic) {
    const plugin = new PuppeteerPlugin(config.puppeteerConfig);
    config.plugins = [plugin];
  }

  // console.log(`doscrape.js setConfig config:`, config);

  return config;
}

/**
 * determine name of selected website scraper
 * @param {Boolean} scrapeWithAxios
 * @param {Boolean} scrapeWithCurl
 * @return {string}
 */
function getScraperName (scrapeWithAxios, scrapeWithCurl) {
  if (scrapeWithAxios) { return 'axios'}
  if (scrapeWithCurl) { return 'curl'}
  return 'website-scraper';
}

/**
 * scrape a single page
 * @param {Object} options - scrapeConfig options
 * @return {Promise<{scraperName: string, directory: string, htmlPath: string, html: string}>}
 */
function doScrape (options) {

  // console.log(`tms-scrape doScrape()`);

  const config = setConfig(options);

  const {
      directory,
      urls,
      scrapeWithAxios,
      scrapeWithCurl,
      removeLinkEls,
      removeStyles,
      removeScripts,
      convertRelativeRefs,
      saveToFile
    } = config,
    htmlPath = directory +
      (directory.slice(-1) !== '/' ? '/index.html' : 'index.html'),
    scraperName = getScraperName(scrapeWithAxios, scrapeWithCurl);

  startTimer();

  return new Promise(resolve => resolve())

    .then(() => {
      // delete target directory if it exists
      if (existsSync(directory)) {
        // console.log(`deleting existing directory: ${directory}`);
        rmSync(directory, {
          maxRetries: 5,
          recursive: true
        });
      }

      // return scraped html text
      if (scrapeWithAxios) { return axiosScrape(config); }
      if (scrapeWithCurl) { return curlScrape(urls[0]);}
      return websiteScraper(config);
    })

    .then(html => {
      // console.log(`  doScrape scraper complete in ${getElapsedTime()} secs`);

      // optionally strip certain elements
      if (removeLinkEls) {
        html = html.replace(
          /<link (.*?)>/sg,
          ''
        );
      }
      if (removeStyles) {
        html = html.replace(
          /<style(.*?)<\/style>/sg,
          ''
        );
        html = html.replace(
          /style="(.*?)"/sg,
          ''
        );
      }
      if (removeScripts) {
        html = html.replace(
          /<script(.*?)<\/script>/sg,
          ''
        );
      }

      const document = new JSDOM(html).window.document;

      // optionally convert relative urls in document
      if (convertRelativeRefs) {
        const urlInfo = getURLInfo(urls[0]);
        relativeRefsToAbsolute(document, urlInfo);
      }

      if (saveToFile) {
        // write updated HTML to file
        mkdirSync(directory, {
          recursive: true,
          mode: 0o777
        });
        writeFileSync(
          htmlPath,
          document.documentElement.outerHTML,
          {encoding: 'utf8'}
        );
      } else {
        // delete destination directory
        rmSync(directory, {
          force: true,
          recursive: true,
          maxRetries: 4
        });
      }

      // console.log(`  tms-scrape complete in ${getElapsedTime()} secs`);

      return {
        scraperName,
        directory,
        htmlPath,
        elapsedTime: getElapsedTime(),
        html: document.documentElement.outerHTML
      };
    })

    .catch(err => {
      console.error(`doScrape Error:`, err);
    });
}

export {
  doScrape
};
