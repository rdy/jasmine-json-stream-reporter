const Helpers = require('./support/helpers');
const JasmineAsync = require('jasmine-async-suite');

JasmineAsync.install();

const globals = {...Helpers};
Object.assign(global, globals);

afterAll(() => {
  Object.keys(globals).forEach(key => delete global[key]);
  JasmineAsync.uninstall();
});