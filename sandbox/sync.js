const retry = require('../');

const targetSync = (min, max) => () => Math.random() * (max - min) + min;

const isResolved = result => result > 19;

const options = {
    intervalTimeout: 1000
};

retry(targetSync(2, 20), options, isResolved)
    .then(result => {
        console.log('result: ', result);
    })
    .catch(() => {
        console.log('error');
    });
