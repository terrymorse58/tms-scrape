// scrape a single URL and store results locally

import scrape from 'website-scraper';
import { existsSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

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
        el[attrName].startsWith('http') ||
        el[attrName].startsWith('//') ||
        el[attrName].startsWith('data:') ||
        el[attrName].length === 0
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
 * scrape a single page
 * @param {Object} options
 * @return {Promise<{directory: string}>}
 */
function doScrape (options) {

  const {directory, urls} = options,
    htmlPath = directory +
      (directory.slice(-1) !== '/' ? '/index.html' : 'index.html');

  return new Promise(resolve => resolve())

    .then(() => {
      // delete target directory if it exists
      if (!existsSync(directory)) { return; }

      // console.log(`deleting existing directory: ${directory}`);
      return rmSync(directory, {
        maxRetries: 5,
        recursive: true
      });
    })

    .then(() => {
      return scrape(options);
    })

    .then(() => {
      // add URL info to <head>
      const url = urls[0],
        urlInfo = getURLInfo(url),
        document = readHtmlFile(htmlPath);

      insertURLInfo(document, urlInfo);

      // convert relative references to absolute
      if (options.convertRelativeRefs) {
        relativeRefsToAbsolute(document, urlInfo);
      }

      return document;
    })

    .then(document => {
      return writeFileSync(
        htmlPath,
        document.documentElement.outerHTML,
        {encoding: 'utf8'}
      );
    })

    .then(() => {
      return {
        directory
      };
    });

}

export {
  doScrape
};
