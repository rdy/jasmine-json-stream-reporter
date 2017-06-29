require('./spec_helper');

describe('JsonStreamReporter', () => {
  const guid = 'some-guid';
  const header = 'some-header: ';
  let subject, completeSpy, printSpy, JsonStreamReporter;
  beforeEach(() => {
    const uuid = require('uuid');
    spyOn(uuid, 'v4').and.returnValue(guid);
    JsonStreamReporter = require('../src/json_stream_reporter');
    printSpy = jasmine.createSpy('print');
    completeSpy = jasmine.createSpy('complete');
    subject = new JsonStreamReporter({header, print: printSpy, onComplete: completeSpy});
  });

  describe('#coverage', () => {
    it('prints the coverage', () => {
      const coverage = {some: 'coverage'};
      subject.coverage(coverage);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({id: [guid, 'coverage'].join(':'), coverage})}`);
    });
  });

  describe('#snapshots', () => {
    it('prints the snapshots', () => {
      const snapshots = [
        {'html':'<a data-reactroot="" href="#historical" class="anchor">hello</a>','name':'Anchor', 'widths': [120]},
        {'html':'<a data-reactroot="" href="#historical" class="anchor disabled">hello</a>','name':'Anchor disabled', 'widths': [120]}
      ];
      subject.snapshots(snapshots);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({id: [guid, 'snapshots'].join(':'), snapshots})}`);
    });
  });

  describe('#suiteStarted', () => {
    it('prints the suite', () => {
      const suite = {id: 1};
      subject.suiteStarted(suite);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({...suite, id: [guid, suite.id, 'suiteStarted'].join(':')})}`);
    });
  });

  describe('#suiteDone', () => {
    it('prints the suite', () => {
      const suite = {id: 1};
      subject.suiteDone(suite);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({...suite, specs: [], id: [guid, suite.id, 'suiteDone'].join(':')})}`);
    });
  });

  describe('#specStarted', () => {
    it('prints the spec', () => {
      const spec = {id: 1};
      subject.specStarted(spec);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({...spec, id: [guid, spec.id, 'specStarted'].join(':')})}`);
    });
  });

  describe('#specDone', () => {
    it('prints the spec', () => {
      const spec = {id: 1};
      subject.specDone(spec);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({...spec, id: [guid, spec.id, 'specDone'].join(':')})}`);
    });
  });

  describe('#jasmineStarted', () => {
    it('prints the suite info', () => {
      const suiteInfo = {some: 'suite info'};
      subject.jasmineStarted(suiteInfo);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({...suiteInfo, id: [guid, 'jasmineStarted'].join(':')})}`);
    });
  });

  describe('#jasmineDone', () => {
    it('calls the on complete callback', () => {
      const options = {done: true};
      subject.jasmineDone(options);
      expect(completeSpy).toHaveBeenCalledWith(options);
    });
  });

  describe('#consoleMessage', () => {
    it('prints the suite info', () => {
      const message = 'some message';
      subject.consoleMessage(message);
      expect(printSpy).toHaveBeenCalledWith(`${header}${JSON.stringify({id: [guid, 'consoleMessage'].join(':'), message})}`);
    });
  });
});