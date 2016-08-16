const uuid = require('uuid');

class JsonStreamReporter {
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