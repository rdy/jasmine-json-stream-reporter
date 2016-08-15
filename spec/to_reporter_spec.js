require('./spec_helper');

describe('ToReporter', () => {
  const guid = 'some-guid';
  let error, from, reporter, spec1, spec2, suite1, stream, subject;
  beforeEach(() => {
    const uuid = require('uuid');
    spyOn(uuid, 'v4').and.returnValue(guid);
    subject = require('../src/to-reporter');
    from = require('from2').obj;
    reporter = jasmine.createSpyObj('reporter', ['jasmineStarted', 'specDone', 'suiteDone', 'jasmineDone']);
    spec1 = {id: [guid, 1, 'spec'].join(':'), status: 'passed'};
    spec2 = {id: [guid, 2, 'spec'].join(':'), status: 'passed'};
    suite1 = {id: [guid, 3, 'suite'].join(':')};
  });

  afterEach(() => {
    stream.destroy();
  });

  describe('when there are no failures', () => {
    beforeEach.async(async () => {
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

    it('calls the reporter jasmine started', () => {
      expect(reporter.jasmineStarted).toHaveBeenCalledWith({});
    });

    it('calls jasmineDone', () => {
      expect(reporter.jasmineDone).toHaveBeenCalledWith({});
    });

    it('calls the reporter specDone', () => {
      expect(reporter.specDone).toHaveBeenCalledWith(spec1);
      expect(reporter.specDone).toHaveBeenCalledWith(spec2);
    });

    it('calls the reporter suiteDone', () => {
      expect(reporter.suiteDone).toHaveBeenCalledWith(suite1);
    });

    it('does not emit an error', () => {
      expect(error).toBeUndefined();
    });
  });

  describe('when there are failures', () => {
    beforeEach.async(async () => {
      spec1 = {id: [guid, 1, 'spec'].join(':'), status: 'failed'};
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