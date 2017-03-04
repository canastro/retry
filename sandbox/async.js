const retry = require('../');

const targetPromise = (min, max) => () => new Promise(resolve => {
    setTimeout(() => {
        console.log('target execution');
        resolve((Math.random() * (max - min)) + min);
    }, 500);
});

const isResolved = result => result > 19;

const options = {
    intervalTimeout: 1000
};

retry(targetPromise(2, 20), options, isResolved)
    .then(result => {
        console.log('result: ', result);
    })
    .catch(() => {
        console.log('error');
    });
