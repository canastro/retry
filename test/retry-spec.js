import test from 'ava';
import sinon from 'sinon';
import retry from '../';
import MaxAttemptsError from '../lib/errors/max-attempts';

test.cb('should reject while using the default value for maxAttempts', t => {
    t.plan(2);

    const target = sinon.stub().returns(Promise.reject());
    retry(target).catch(err => {
        t.truthy(err instanceof MaxAttemptsError);
        t.is(target.callCount, 10);
        t.end();
    });
});

test.cb('should reject while using the configured value for maxAttempts', t => {
    t.plan(2);

    const target = sinon.stub().returns(Promise.reject());
    retry(target, {maxAttempts: 5}).catch(err => {
        t.true(err instanceof MaxAttemptsError);
        t.is(target.callCount, 5);
        t.end();
    });
});

test.cb('should resolve after 3 attempts', t => {
    t.plan(2);

    const target = sinon.stub();
    target.returns(Promise.reject());
    target.onCall(2).returns(Promise.resolve('DUMMY-RESPONSE'));

    retry(target, {maxAttempts: 5}).then(result => {
        t.is(result, 'DUMMY-RESPONSE');
        t.is(target.callCount, 3);
        t.end();
    });
});

test.cb('should add timeout between attempts', t => {
    t.plan(3);

    const target = sinon.stub();
    target.returns(Promise.reject());
    target.onCall(2).returns(Promise.resolve('DUMMY-RESPONSE'));

    const options = {
        intervalTimeout: 1000
    };

    const t0 = new Date().getTime();

    retry(target, options).then(result => {
        const t1 = new Date().getTime();
        const diff = t1 - t0;

        t.is(result, 'DUMMY-RESPONSE');
        t.is(target.callCount, 3);
        t.true(diff > 2000);

        t.end();
    });
});

test.cb('should stop when the assertation function returns true', t => {
    t.plan(1);

    const assertationStub = sinon.stub();
    assertationStub.returns(false);
    assertationStub.onCall(2).returns(true);

    const target = sinon.stub();
    target.returns('FAILURE');
    target.onCall(2).returns('success');

    retry(target, null, assertationStub).then(() => {
        t.is(target.callCount, 3);
        t.end();
    });
});
