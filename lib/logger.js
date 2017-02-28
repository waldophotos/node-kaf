/**
 * @fileOverview Provides root and child loggers.
 */

var bunyan = require('bunyan');
var fmt = require('bunyan-format');

var bunyanInst = null;

/**
 * Boot and return bunyan logger.
 *
 * @param {Object} opts Options for the logger.
 *   @param {string} outputMode Define the output mode, can be `short` or `long`.
 *   @param {string} logLevel Define the log level.
 * @return {bunyan} Bunyan logger.
 */
module.exports = function(opts) {
  if (bunyanInst) {
    return bunyanInst;
  }
  bunyanInst = bunyan.createLogger({
    name: 'kaf',
    stream: fmt({
      outputMode: opts.outputMode || 'long',
      levelInString: true,
      color: true,
    }),
    level: opts.logLevel || 'debug',
  });

  return bunyanInst;
};
