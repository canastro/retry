const MaxAttemptsError = require('./errors/max-attempts');

/**
 * Default assertation function
 * Used if the user does not provide a assert fn
 * @method  defaultAssert
 * @returns {Boolean}
 */
const defaultAssert = () => true;

/**
 * Its initialized with a intial value and returns
 * a function that when called increments the initial
 * value
 * @method  counter
 * @param   {Number} count  - Iterations counter
 * @returns {Number}
 */
const counter = count => () => ++count;

/**
 * Creates a timeout promise to be called between attempts
 * @method addTimeout
 * @param   {Number}   timeout
 * @returns {Promise}
 */
const addTimeout = timeout => new Promise(
    (resolve, reject) => setTimeout(resolve, timeout)
);

/**
 * Recursive function that will call the user's wrapped function
 * until it resolves or until it exceeds the number of max attempts
 * @method  execute
 * @param   {Function} fn           - user's wrapped function
 * @param   {Function} assertResult - user's validation function
 * @returns {Promise}
 */
const execute = (fn, assertResult, options) => fn()
    .then(result => {
        const isResolved = assertResult(result);
        if (isResolved) {
            return result;
        }

        return addTimeout(options.intervalTimeout)
            .then(() => execute(fn, assertResult, options));
    })
    .catch(err => {
        if (err instanceof MaxAttemptsError) {
            throw err;
        }

        return addTimeout(options.intervalTimeout)
            .then(() => execute(fn, assertResult, options));
    });

/**
 * Wrapper function around the user's provided function
 * If the function is a Promise, then it executes it
 * Otherwise it converts it into a array
 * Before executing the user's funciton a validation is made to
 * ensure that the maxAttempts hasn't reached
 * @method  wrapper
 * @param   {Function} fn                       - User's function to execute
 * @param   {Function} increment                - Iteration incremental function
 * @param   {Object}   options                  - User's options
 * @param   {Number}   [options.maxAttempts]    - Number of max attempts allowed
 * @returns {Promise}
 */
const wrapper = (fn, increment, options) => () => new Promise((resolve, reject) => {
    const iterations = increment();

    if (iterations >= options.maxAttempts) {
        return reject(new MaxAttemptsError('test'));
    }

    const result = fn();

    if (typeof fn.then === 'function') {
        return result.then(resolve).catch(reject);
    }

    return resolve(result);
});

/**
 * Executes a user function until it resolves or achieves
 * max attempts
 * @method  retry
 * @param   {Function} fn           - callback
 * @param   {Object}   [opts={}]    - Options
 * @param   {Function} assertResult - validation function
 * @returns {Promise}
 */
const retry = (fn, opts = {}, assertResult = defaultAssert) => {
    const options = Object.assign({}, {
        maxAttempts: 9,
        intervalTimeout: 0
    }, opts);

    const countup = counter(0);

    return execute(
        wrapper(fn, countup, options),
        assertResult,
        options
    );
};

module.exports = retry;
