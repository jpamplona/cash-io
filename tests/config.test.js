const {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
  isValidCashInConfig,
  isValidCashOutNaturalConfig,
  isValidCashOutJuridicalConfig,
  validateConfigurations,
} = require('../src/controllers/config');

describe('Cash In/Out Configurations', () => {
  const configCashIn = {
    percents: 0.03,
    max: {
      amount: 5,
      currency: 'EUR',
    },
  };
  const invalidCashInConfig = {
    max: {
      amount: 10,
      currency: 'EUR',
    },
  };
  const configCashOutNatural = {
    percents: 0.3,
    week_limit: {
      amount: 1000,
      currency: 'EUR',
    },
  };
  const invalidCashOutNaturalConfig = {
    percents: 0.3,
    week_limit: {
      currency: 'EUR',
    },
  };
  const configCashOutJuridical = {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: 'EUR',
    },
  };
  const invalidCashOutJuridicalConfig = {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: 'USD',
    },
  };

  it('Should receive Cash In Configuration', () => {
    getCashInConfig.then((config) => {
      expect(config).toBeTruthy();
      expect(typeof config).toBe('object');
      expect(config).toMatchObject(configCashIn);
    });
  });
  it('Should be true since Cash In Configuration is valid', () => {
    const result = isValidCashInConfig(configCashIn);
    expect(result).toBeTruthy();
  });
  it('Should be false since Cash In Configuration is invalid', () => {
    const result = isValidCashInConfig(invalidCashInConfig);
    expect(result).toBeFalsy();
  });
  it('Should receive Cash Out Configuration for Natural Persons', () => {
    getCashOutNaturalConfig.then((config) => {
      expect(config).toBeTruthy();
      expect(typeof config).toBe('object');
      expect(config).toMatchObject(configCashOutNatural);
    });
  });
  it('Should be true since Cash Out Configuration (Natural) is valid', () => {
    const result = isValidCashOutNaturalConfig(configCashOutNatural);
    expect(result).toBeTruthy();
  });
  it('Should be false since Cash Out Configuration (Natural) is invalid', () => {
    const result = isValidCashOutNaturalConfig(invalidCashOutNaturalConfig);
    expect(result).toBeFalsy();
  });
  it('Should receive Cash Out Configuration for Legal Persons', () => {
    getCashOutJuridicalConfig.then((config) => {
      expect(config).toBeTruthy();
      expect(typeof config).toBe('object');
      expect(config).toMatchObject(configCashOutJuridical);
    });
  });
  it('Should be true since Cash Out Configuration (Juridical) is valid', () => {
    const result = isValidCashOutJuridicalConfig(configCashOutJuridical);
    expect(result).toBeTruthy();
  });
  it('Should be false since Cash Out Configuration (Juridical) is invalid', () => {
    const result = isValidCashOutJuridicalConfig(invalidCashOutJuridicalConfig);
    expect(result).toBeFalsy();
  });
  it('Should prevent application to process transactions due to Invalid Cash In configuration', () => {
    expect(() => validateConfigurations(
      invalidCashInConfig,
      configCashOutNatural,
      configCashOutJuridical,
    )).toThrow();
  });
  it('Should prevent application to process transactions due to Invalid Cash Out (Natural) configuration', () => {
    expect(() => validateConfigurations(
      configCashIn,
      invalidConfigCashOutNatural,
      configCashOutJuridical,
    )).toThrow();
  });
  it('Should prevent application to process transactions due to Invalid Cash Out (Juridical) configuration', () => {
    expect(() => validateConfigurations(
      configCashIn,
      configCashOutNatural,
      invalidCashOutJuridicalConfig,
    )).toThrow();
  });
});
