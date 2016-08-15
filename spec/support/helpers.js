const {obj: through} = require('through2');

module.exports = {
  waitFor(stream) {
    return new Promise((resolve, reject) => {
      const result = [];
      return stream.once('error', reject).pipe(through((chunk, enc, next) => {
        result.push(chunk);
        next(null, chunk);
      }, flush => {
        resolve(result);
        stream.destroy();
        flush();
      }));
    });
  }
};