const {obj: through} = require('through2');

function handleFailures(failures, onError) {
  this.emit('error', onError(`${failures} ${failures === 1 ? 'failure' : 'failures'}`));
}

module.exports = function(reporter, options = {}) {
  const {onError = message => new Error(message), onMessage = message => process.stdout.write(message)} = options;
  let failures = 0;

  function specDone(chunk) {
    if (chunk.status === 'failed') failures++;
  }

  function message({message}) {
    if (reporter.print) return reporter.print(message);
    onMessage(message);
  }

  const events = {specStarted: true, specDone, suiteStarted: true, suiteDone: true, jasmineStarted: true, jasmineDone: true, message};
  return through(function(chunk, enc, next) {
    for (let key in events) {
      if (events.hasOwnProperty(key)) {
        const value = events[key];
        if (!chunk.id.endsWith(`:${key}`)) continue;
        if (typeof value === 'function') value(chunk);
        if (key in reporter) reporter[key](chunk);
        break;
      }
    }
    next(null, chunk);
  }, function(flush) {
    reporter.jasmineDone();
    if (failures) this::handleFailures(failures, onError);
    flush();
  });
};
