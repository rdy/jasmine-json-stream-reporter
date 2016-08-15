require('./spec_helper');

describe('JsonStreamReporter', () => {
  const guid = 'some-guid';
  let subject, printSpy, JsonStreamReporter;
  beforeEach(() => {
    const uuid = require('uuid');
    spyOn(uuid, 'v4').and.returnValue(guid);
    JsonStreamReporter = require('../src/json_stream_reporter');
    printSpy = jasmine.createSpy('print');
    subject = new JsonStreamReporter({print: printSpy});
  });

  describe('#suiteDone', () => {
    it('prints the suite', () => {
      const suite = {id: 1};
      subject.suiteDone(suite);
      expect(printSpy).toHaveBeenCalledWith(JSON.stringify({...suite, specs: [], id: [guid, suite.id, 'suite'].join(':')}));
    });
  });

  describe('#specDone', () => {
    it('prints the spec', () => {
      const spec = {id: 1};
      subject.specDone(spec);
      expect(printSpy).toHaveBeenCalledWith(JSON.stringify({...spec, id: [guid, spec.id, 'spec'].join(':')}));
    });
  });
});