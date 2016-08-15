const uuid = require('uuid');
const {obj: through} = require('through2');

function handleFailures(failures, onError) {
  this.emit('error', onError(`${failures} ${failures === 1 ? 'failure' : 'failures'}`));
}

class JsonStreamReporter {
  static toReporter = function(reporter, options = {}) {
    const {onError = message => new Error(message)} = options;
    let failures = 0;
    const result = {};
    reporter.jasmineStarted(result);
    return through(function(chunk, enc, next) {
      if (chunk.id.endsWith(':spec')) {
        if (chunk.status === 'failed') failures++;
        reporter.specDone(chunk);
      } else if (chunk.id.endsWith(':suite')) {
        reporter.suiteDone(chunk);
      }
      next(null, chunk);
    }, function(flush) {
      reporter.jasmineDone(result);
      if (failures) this::handleFailures(failures, onError);
      flush();
    });
  };

  constructor(options = {}) {
    this._specResults = [];
    this._uuid = uuid.v4();

    /* eslint-disable no-console */
    this.print = options.print || console.log;
    /* eslint-enable no-console */
  }

  suiteDone(suite) {
    suite = {...suite, id: [this._uuid, suite.id, 'suite'].join(':'), specs: this._specResults};
    this.print(JSON.stringify(suite));
    this._specResults = [];
  };

  specDone(spec) {
    spec = {...spec, id: [this._uuid, spec.id, 'spec'].join(':')};
    this.print(JSON.stringify(spec));
    this._specResults.push(spec);
  };

  jasmineDone() {}
}

module.exports = JsonStreamReporter;