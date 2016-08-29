const uuid = require('uuid');

function generateId(name, {id} = {}) {
  return [this.uuid, id, name].filter(Boolean).join(':');
}

class JsonStreamReporter {
  static defaultHeader = '';

  constructor(options = {}) {
    const {header = JsonStreamReporter.defaultHeader} = options;

    this.specResults = [];
    this.uuid = uuid.v4();

    /* eslint-disable no-console */
    this.print = options.print || function(...args) { console.log(...args); };
    this.onComplete = options.onComplete || function() {};
    /* eslint-enable no-console */
    this.format = options.format || function(obj) { return `${header}${JSON.stringify(obj)}`; };
  }

  consoleMessage(message) {
    const obj = {id: this::generateId('consoleMessage'), message};
    this.print(this.format(obj));
  }

  suiteStarted(suite) {
    suite = {...suite, id: this::generateId('suiteStarted', suite)};
    this.print(this.format(suite));
  }

  suiteDone(suite) {
    suite = {...suite, id: this::generateId('suiteDone', suite), specs: this.specResults};
    this.print(this.format(suite));
    this.specResults = [];
  }

  specStarted(spec) {
    spec = {...spec, id: this::generateId('specStarted', spec)};
    this.print(this.format(spec));
  }

  specDone(spec) {
    spec = {...spec, id: this::generateId('specDone', spec)};
    this.print(this.format(spec));
    this.specResults.push(spec);
  }

  jasmineStarted(specInfo) {
    specInfo = {...specInfo, id: this::generateId('jasmineStarted')};
    this.print(this.format(specInfo));
  }

  jasmineDone(options) {
    this.onComplete(options);
  }
}

module.exports = JsonStreamReporter;