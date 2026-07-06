const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to a directory within the project
  // so it persists from build to runtime container on Render.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
