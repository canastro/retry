const dns = require('dns');
const retry = require('../');

const target = address => () => new Promise((resolve, reject) => {
    dns.resolve(address, (err, addresses) => {
        if (err) {
            return reject(err);
        }

        return resolve(addresses);
    });
});

retry(target('nodejsusduadiuhas.org'))
    .then(result => {
        console.log('result: ', result);
    })
    .catch(() => {
        console.log('error');
    });
