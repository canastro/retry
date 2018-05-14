![build status](https://travis-ci.org/canastro/retry.svg?branch=master)
[![npm version](https://badge.fury.io/js/%40canastro%2Fretry.svg)](https://badge.fury.io/js/%40canastro%2Fretry)
[![codecov](https://codecov.io/gh/canastro/retry/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/retry)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# Retry
Naive implementation of a retry system.

# Features
* Max attempts
* Add delay between retries
* Callback to interrupt retries

# Installation
```
npm install --save @canastro/retry
```

# Usage

```js
const retry = require('@canastro/retry');
const generateNumber = (min, max) => () => (Math.random() * (max - min)) + min;

const isBiggerThanNineteen = result => result > 19;

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
retry(generateNumber(2, 20), options, isBiggerThanNineteen)
    .then(result => {
        console.log('result: ', result);
    })
    .catch(() => {
        console.log('error');
    });
```

PS: Check sandbox for more examples, you can try them by running `node sandbox/#filename#`


### Parameters
| Parameter | Type | Default | Description
| :-------: | :---: | :-----: | :--------:|
| callback | Function | | User's function to be retried |
| options | Object | {} | User's options |
| [options.maxAttempts] | Number |  10 | Number of max attempts |
| [options.intervalTimeout] | Number | 0ms | Number of milliseconds to wait before retrying |
| isResolved | Function | () => true | Function to be used as a stop condition |

### Returns
* If a `isResolved` function is provided it will return a fulfilled promise when this returns true;
* If no `isResolved` was given it will return true once the provided callback is correctly fulfilled;
* It will return a rejected promise the max attempts was reached
