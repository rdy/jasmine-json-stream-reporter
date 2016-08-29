const {obj: through} = require('through2');

function handleFailures(failures, onError) {
  this.emit('error', onError(`${failures} ${failures === 1 ? 'failure' : 'failures'}`));
}

module.exports = function(reporters, options = {}) {
  if (!Array.isArray(reporters)) reporters = [reporters];
  const {onError = message => new Error(message), onConsoleMessage = () => {}} = options;
  let failures = 0;

  function specDone(chunk) {
    if (chunk.status === 'failed') failures++;
  }

  function consoleMessage({message}) {
    reporters.forEach(reporter => reporter.print && reporter.print(message));
    onConsoleMessage(message);
  }

  const events = {specStarted: true, specDone, suiteStarted: true, suiteDone: true, jasmineStarted: true, jasmineDone: true, consoleMessage};
  return through(function(chunk, enc, next) {
    Object.keys(events).find(key => {
      const value = events[key];
      if (!chunk.id.endsWith(`:${key}`)) return false;
      if (typeof value === 'function') value(chunk);
      reporters.forEach(reporter => key in reporter && reporter[key](chunk));
      return true;
    });
    next(null, chunk);
  }, function(flush) {
    reporters.forEach(reporter => reporter.jasmineDone());
    if (failures) this::handleFailures(failures, onError);
    flush();
  });
};
