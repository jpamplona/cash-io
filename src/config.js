/* eslint-disable no-unused-expressions */
const http = require('http');

const BASE_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config';

// eslint-disable-next-line arrow-body-style
const getConfig = (url) => {
  // eslint-disable-next-line no-new
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const { statusCode, headers } = res;
        const contentType = headers['content-type'];

        statusCode !== 200
          ? reject(new Error(`Failed performing the request.\nGET  ${url}  ${statusCode}`))
          : false;

        contentType !== 'application/json'
          ? reject(new Error(`Invalid content-type '${contentType}': Expecting 'application/json'.`))
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
  }).catch((err) => {
    throw new Error(`Failed to get configuration.${err.message}`);
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
