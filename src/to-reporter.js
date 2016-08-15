const {obj: through} = require('through2');

function handleFailures(failures, onError) {
  this.emit('error', onError(`${failures} ${failures === 1 ? 'failure' : 'failures'}`));
}

module.exports = function(reporter, options = {}) {
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
