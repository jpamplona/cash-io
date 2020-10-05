const { computeCommissionFeeCashIn, getCommissionFeeCashIn } = require('../src/controllers/cash-in');

describe('Cash In', () => {
  const config = {
    percents: 0.03,
    max: {
      amount: 5,
      currency: 'EUR',
    },
  };
  const allowedCurrencies = ['EUR'];

  describe('Compute Cash In Commission Fee', () => {
    const {
      percents,
      max: { amount: maxAmount },
    } = config;
    it('Commission fee should be 0.00 given the amount 0.00', () => {
      const amount = 0.00;
      const result = computeCommissionFeeCashIn(amount, percents, maxAmount);

      expect(result).toEqual('0.00');
    });
    it('Commission fee should be 0.09 given the amount 300.00 (less than the maximum allowed commission fee)', () => {
      const amount = 300.00;
      const result = computeCommissionFeeCashIn(amount, percents, maxAmount);

      expect(result).toEqual('0.09');
    });
    it('Commission fee should be 0.04 given the amount 150.00 (less than the maximum allowed commission fee)', () => {
      const amount = 150.00;
      const result = computeCommissionFeeCashIn(amount, percents, maxAmount);

      expect(result).toEqual('0.04');
    });
    it('Commission fee should be 5.00 given the amount 200000.00 (greater than the maximum allowed commission fee)', () => {
      const amount = 200000.00;
      const result = computeCommissionFeeCashIn(amount, percents, maxAmount);

      expect(result).toEqual('5.00');
    });
    it('Commission fee should be 5.00 given the amount 30000.00 (greater than the maximum allowed commission fee)', () => {
      const amount = 30000.00;
      const result = computeCommissionFeeCashIn(amount, percents, maxAmount);

      expect(result).toEqual('5.00');
    });
  });

  describe('Get Cash In Commission Fee', () => {
    it('Should get the computed commission fee', () => {
      const transaction = {
        date: '2016-01-10',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_in',
        operation: {
          amount: 1000000.00,
          currency: 'EUR',
        },
      };
      const result = getCommissionFeeCashIn(
        allowedCurrencies,
        transaction,
        config,
      );

      expect(result).toEqual('5.00');
    });
    it('Should block invalid transaction type', () => {
      const transaction = {
        date: '2016-01-12',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 300.00,
          currency: 'EUR',
        },
      };
      const result = getCommissionFeeCashIn(
        allowedCurrencies,
        transaction,
        config,
      );

      expect(result).toEqual('Invalid Cash In transaction.');
    });
    it('Should block invalid transaction currency', () => {
      const transaction = {
        date: '2016-01-12',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 300.00,
          currency: 'PHP',
        },
      };
      const result = getCommissionFeeCashIn(
        allowedCurrencies,
        transaction,
        config,
      );

      expect(result).toEqual('Invalid Cash In transaction.');
    });
    it('Should block invalid config currency', () => {
      const transaction = {
        date: '2016-01-12',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 300.00,
          currency: 'EUR',
        },
      };
      const clonedConfig = { ...config };
      clonedConfig.max.currency = 'PHP';

      const result = getCommissionFeeCashIn(
        allowedCurrencies,
        transaction,
        clonedConfig,
      );

      expect(result).toEqual('Invalid Cash In transaction.');
    });
    it('Should block different currencies for transaction and config', () => {
      const transaction = {
        date: '2016-01-12',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 300.00,
          currency: 'USD',
        },
      };

      const result = getCommissionFeeCashIn(
        allowedCurrencies,
        transaction,
        config,
      );

      expect(result).toEqual('Invalid Cash In transaction.');
    });
  });
});
