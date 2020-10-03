const http = require('http');

const BASE_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config';

// eslint-disable-next-line arrow-body-style
const getConfig = (url) => {
  // eslint-disable-next-line no-new
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const { statusCode } = res;

        // eslint-disable-next-line no-unused-expressions
        statusCode !== 200
          ? reject(new Error(`Failed performing the request.\nGET  ${url}  ${statusCode}`))
          : false;

        res.setEncoding('utf-8');

        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(body));
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const getCashInConfig = getConfig(`${BASE_URL}/cash-in`);
const getCashOutNaturalConfig = getConfig(`${BASE_URL}/cash-out/natural`);
const getCashOutJuridicalConfig = getConfig(`${BASE_URL}/cash-out/juridical`);

module.exports = {
  getConfig,
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
};
