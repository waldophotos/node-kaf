#!/usr/bin/env node

/**
 * kaf
 * "kaf" Command line tool for consuming kafka messages deserialized with avro.
 * https://github.com/waldo/node-kaf
 *
 * Copyright © Waldo, Inc.
 * All rights reserved.
 */

/**
 * @fileOverview bootstrap and master exporing module.
 */

var program = require('commander');

var logger = require('./logger');

program
  .version('0.0.1')
  .usage('[options] <topic names ...>')
  .option('-b, --broker [broker]', 'Set kafka brokers, overrides env var KAFKA_BROKER')
  .option('-s, --schema-registry [sr]', 'Set Schema Registry url, overrides env var SCHEMA_REGISTRY')
  .option('-o, --output-mode [mode]', 'Define the logger output mode, can be "short"' +
    ' or "long", default is "long".')
  .option('-l, --log-level [level]', 'Set the log level, default is "info", can be "debug"')
  .parse(process.argv);

// boot logger
var log = logger({
  outputMode: program.outputMode,
  logLevel: program.logLevel,
});

log.debug('Booting kaf');

// Require kaf after logger init so its there.
var kaf = require('./kaf');

kaf.start(program);
