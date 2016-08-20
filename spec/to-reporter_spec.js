require('./spec_helper');

describe('ToReporter', () => {
  const guid = 'some-guid';
  let error, from, reporter, spec1Started, spec1, spec2Started, spec2, suite1Started, suite1, stream, subject, jasmineStarted, message;
  beforeEach(() => {
    const uuid = require('uuid');
    spyOn(uuid, 'v4').and.returnValue(guid);
    subject = require('../src/to-reporter');
    from = require('from2').obj;
    reporter = jasmine.createSpyObj('reporter', ['specStarted', 'specDone', 'suiteStarted', 'suiteDone', 'jasmineStarted', 'jasmineDone', 'print']);
    jasmineStarted = {id: ':jasmineStarted', spec: 'info'};
    spec1Started = {id: [guid, 1, 'specStarted'].join(':'), started: true};
    spec1 = {id: [guid, 1, 'specDone'].join(':'), status: 'passed'};
    spec2Started = {id: [guid, 2, 'specStarted'].join(':'), started: true};
    spec2 = {id: [guid, 2, 'specDone'].join(':'), status: 'passed'};
    suite1 = {id: [guid, 3, 'suiteDone'].join(':')};
    suite1Started = {id: [guid, 3, 'suiteStarted'].join(':'), started: true};
    message = {id: [guid, 'message'].join(':'), message: 'some messae'};
  });

  afterEach(() => {
    stream.destroy();
  });

  describe('when there are no failures', () => {
    beforeEach.async(async () => {
      stream = from([jasmineStarted, spec1Started, spec1, spec2Started, spec2, suite1Started, suite1, message]);
      stream.pause();
      const promise = waitFor(stream.pipe(subject(reporter)));
      stream.resume();
      try {
        await promise;
      } catch(e) {
        error = e;
      }
    });

    it('calls the reporter spec started', () => {
      expect(reporter.specStarted).toHaveBeenCalledWith(spec1Started);
      expect(reporter.specStarted).toHaveBeenCalledWith(spec2Started);
    });

    it('calls the reporter suiteDone', () => {
      expect(reporter.suiteDone).toHaveBeenCalledWith(suite1);
    });

    it('calls the reporter suiteStarted', () => {
      expect(reporter.suiteStarted).toHaveBeenCalledWith(suite1Started);
    });

    it('calls the reporter jasmine started', () => {
      expect(reporter.jasmineStarted).toHaveBeenCalledWith(jasmineStarted);
    });

    it('calls the reporter jasmine done', () => {
      expect(reporter.jasmineDone).toHaveBeenCalled();
    });

    it('calls the reporter print with the message', () => {
      expect(reporter.print).toHaveBeenCalledWith(message.message);
    });

    it('does not emit an error', () => {
      expect(error).toBeUndefined();
    });
  });

  describe('when there are failures', () => {
    beforeEach.async(async () => {
      spec1 = {id: [guid, 1, 'specDone'].join(':'), status: 'failed'};
      stream = from([spec1, spec2, suite1]);
      stream.pause();
      const promise = waitFor(stream.pipe(subject(reporter)));
      stream.resume();
      try {
        await promise;
      } catch(e) {
        error = e;
      }
    });

    it('emits an error', () => {
      expect(error).toEqual(new Error('1 failure'));
    });
  });
});