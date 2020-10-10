/* eslint-disable no-unused-expressions */
import http from 'http';
import {
  schemaCashInConfig,
  schemaCashOutNaturalConfig,
  schemaCashOutJuridicalConfig,
} from '../schema';

const BASE_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config';

// eslint-disable-next-line arrow-body-style
export const getConfig = (url) => {
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

export const getCashInConfig = getConfig(`${BASE_URL}/cash-in`);
export const getCashOutNaturalConfig = getConfig(`${BASE_URL}/cash-out/natural`);
export const getCashOutJuridicalConfig = getConfig(`${BASE_URL}/cash-out/juridical`);

export const isValidCashInConfig = (config) => {
  const { error } = schemaCashInConfig.validate(config);
  return !error;
};

export const isValidCashOutNaturalConfig = (config) => {
  const { error } = schemaCashOutNaturalConfig.validate(config);
  return !error;
};

export const isValidCashOutJuridicalConfig = (config) => {
  const { error } = schemaCashOutJuridicalConfig.validate(config);
  return !error;
};

export const validateConfigurations = (
  configCashIn,
  configCashOutNatural,
  configCashOutJuridical,
) => {
  const errMessage = 'Unable to process transactions';

  if (!isValidCashInConfig(configCashIn)) {
    throw new Error(`${errMessage}: Invalid Cash In configuration`);
  }

  if (!isValidCashOutNaturalConfig(configCashOutNatural)) {
    throw new Error(`${errMessage}: Invalid Cash Out(Natural) configuration`);
  }

  if (!isValidCashOutJuridicalConfig(configCashOutJuridical)) {
    throw new Error(`${errMessage}: Invalid Cash Out(Juridical) configuration`);
  }
};
