/**
 * @fileOverview Kaf cli tool.
 */
var crypto = require('crypto');

var Kafking = require('@waldo/kafking');

var log = require('./logger')();

var kaf = module.exports = {};

/**
 * Start kaf.
 *
 * @param {Commander} program The commander instance.
 * @return {Promise} A Promise.
 */
kaf.start = function(program) {
  var opts = {
    kafkaBroker: program.broker || process.env.KAFKA_BROKER || 'localhost:9092',
    schemaRegistry: program.schemaRegistry || process.env.SCHEMA_REGISTRY ||
      'http://localhost:8081/',
    noProducer: true,
    consumerOpts: {
      'group.id': 'kaf-' + crypto.randomBytes(20).toString('hex'),
      'socket.keepalive.enable': true,
      'enable.auto.commit': true,
      'auto.commit.interval.ms': 30000,
    },
    consumerTopics: program.args,
  };

  log.debug('Kafking options:', opts);

  log.info('Booting Kafking... (Kafka + Avro sweetness)');
  var kafking = new Kafking(opts);
  return kafking.init()
    .bind(this)
    .then(function() {
      log.info('Kafking booted, starting to listen on topics:', program.args);
      kafking.on('data', kaf._handleMessage);
    });
};

/**
 * Handle a kafka message.
 *
 * @param {Object} message The raw kafka message.
 * @private
 */
kaf._handleMessage = function(message) {
  log.info(`Received message :: Topic: ${ message.topic }`,
    `Partition: ${ message.partition} Offset: ${ message.offset } `,
    `Key: ${ message.key} Size: ${message.size} SchemaId: ${ message.schemaId} `,
    'message:\n', message.parsed);
};
