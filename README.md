![build status](https://travis-ci.org/canastro/retry.svg?branch=master)
[![npm version](https://badge.fury.io/js/%40canastro%2Fretry.svg)](https://badge.fury.io/js/%40canastro%2Fretry)
[![codecov](https://codecov.io/gh/canastro/retry/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/retry)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# Retry
Naive implementation of a retry system

# Installation
```
npm install --save @canastro/retry
```

# Usage

```js
const callback = (min, max) => () => (Math.random() * (max - min)) + min;

const assertResult = result => result > 19;

const options = {
    maxAttempts: 5,
    intervalTimeout: 1000
};

/**
 * This example will call a function that generates
 * a number between 2 and 20, and it will try for 5 times
 * to get a result higher then 19, having a delay
 * of 1000ms between each execution
 */
retry(callback(2, 20), options, assertResult)
    .then(result => {
        console.log('result: ', result);
    })
    .catch(() => {
        console.log('error');
    });
```


### Parameters
| Parameter | Type | Default | Description
| :-------: | :---: | :-----: | :--------:|
| callback | Function | | User's function to be retried |
| options | Object | {} | User's options |
| [options.maxAttempts] | Number |  10 | Number of max attempts |
| [options.intervalTimeout] | Number | 0ms | Number of milliseconds to wait before retrying |
| assertResult | Function | () => true | Assertation function to be used as a stop condition |
