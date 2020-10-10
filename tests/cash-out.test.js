/* eslint-disable quote-props */
import {
  computeCommissionFeeCashOutNatural,
  computeCommissionFeeCashOutJuridical,
  getCommissionFeeCashOutNatural,
  getCommissionFeeCashOutJuridical,
  getCommissionFeeCashOut,
} from '../src/controllers/cash-out';

describe('Cash Out', () => {
  const allowedCurrencies = ['EUR'];

  describe('Cash Out for Natural Persons', () => {
    describe('Compute Cash Out Natural Commission Fee', () => {
      const config = {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      };
      const {
        percents,
        week_limit: { amount: weeklyAmountLimit },
      } = config;

      it('Commission fee should be 0.00 given the amount 0.00', () => {
        const amount = 0.00;
        const userId = 1;
        const weekTransactionHistory = {
          '1': [
            {
              date: new Date('2016-01-05T00:00:00.000Z'),
              userId: 1,
              amount: 0.00,
            },
          ],
        };
        const result = computeCommissionFeeCashOutNatural(
          amount,
          percents,
          weekTransactionHistory,
          weeklyAmountLimit,
          userId,
        );
        expect(result).toEqual('0.00');
      });
      it('Commission fee should be 0.00 given the amount 300.00 and week total amount 500.00 (provide free charge if transaction difference is zero or less)', () => {
        const amount = 300.00;
        const userId = 1;
        const weekTransactionHistory = {
          '1': [
            {
              date: new Date('2016-01-05T00:00:00.000Z'),
              userId: 1,
              amount: 200.00,
            },
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 1,
              amount: 300.00,
            },
          ],
          '2': [
            {
              date: new Date('2016-01-05T00:00:00.000Z'),
              userId: 2,
              amount: 1500.00,
            },
            {
              date: new Date('2016-01-07T00:00:00.000Z'),
              userId: 2,
              amount: 3000.00,
            },
          ],
          '3': [
            {
              date: new Date('2016-01-05T00:00:00.000Z'),
              userId: 3,
              amount: 150.00,
            },
          ],
        };
        const result = computeCommissionFeeCashOutNatural(
          amount,
          percents,
          weekTransactionHistory,
          weeklyAmountLimit,
          userId,
        );
        expect(result).toEqual('0.00');
      });
      it('Commission fee should be 57.00 given the amount 20000.00 and week total amount 20000.00 (commission is calculated only from exceeded amount)', () => {
        const amount = 20000.00;
        const userId = 1;
        const weekTransactionHistory = {
          '1': [
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 1,
              amount: 20000.00,
            },
          ],
          '2': [
            {
              date: new Date('2016-01-07T00:00:00.000Z'),
              userId: 2,
              amount: 1600.00,
            },
          ],
          '3': [
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 3,
              amount: 25000.00,
            },
          ],
        };
        const result = computeCommissionFeeCashOutNatural(
          amount,
          percents,
          weekTransactionHistory,
          weeklyAmountLimit,
          userId,
        );
        expect(result).toEqual('57.00');
      });
      it('Commission fee should be 3.00 given the amount 1000.00 and week total amount 31000.00 (commission is calculated normally)', () => {
        const amount = 1000.00;
        const userId = 1;
        const weekTransactionHistory = {
          '1': [
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 1,
              amount: 30000.00,
            },
            {
              date: new Date('2016-01-07T00:00:00.000Z'),
              userId: 1,
              amount: 1000.00,
            },
          ],
          '2': [
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 2,
              amount: 3700.00,
            },
          ],
          '3': [
            {
              date: new Date('2016-01-06T00:00:00.000Z'),
              userId: 3,
              amount: 1500.00,
            },
            {
              date: new Date('2016-01-07T00:00:00.000Z'),
              userId: 3,
              amount: 3600.00,
            },
          ],
        };
        const result = computeCommissionFeeCashOutNatural(
          amount,
          percents,
          weekTransactionHistory,
          weeklyAmountLimit,
          userId,
        );
        expect(result).toEqual('3.00');
      });
    });

    describe('Get Cash Out Commission Fee', () => {
      const config = {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      };
      it('Should get the computed commission fee', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'natural',
          type: 'cash_out',
          operation: {
            amount: 30000.00,
            currency: 'EUR',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          config,
        );

        expect(result).toEqual('87.00');
      });
      it('Should block invalid transaction type', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'natural',
          type: 'cash_in',
          operation: {
            amount: 30000.00,
            currency: 'EUR',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          config,
        );

        expect(result).toEqual('Invalid Cash Out(Natural) transaction.');
      });
      it('Should block invalid user type', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'juridical',
          type: 'cash_out',
          operation: {
            amount: 30000.00,
            currency: 'EUR',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          config,
        );

        expect(result).toEqual('Invalid Cash Out(Natural) transaction.');
      });
      it('Should block invalid transaction currency', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'natural',
          type: 'cash_out',
          operation: {
            amount: 30000.00,
            currency: 'PHP',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          config,
        );

        expect(result).toEqual('Invalid Cash Out(Natural) transaction.');
      });
      it('Should block invalid config currency', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'natural',
          type: 'cash_out',
          operation: {
            amount: 30000.00,
            currency: 'EUR',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const clonedConfig = { ...config };
        clonedConfig.week_limit.currency = 'PHP';
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          clonedConfig,
        );

        expect(result).toEqual('Invalid Cash Out(Natural) transaction.');
      });
      it('Should block different currencies for transaction and config', () => {
        const transaction = {
          date: '2016-02-23',
          user_id: 2,
          user_type: 'natural',
          type: 'cash_out',
          operation: {
            amount: 30000.00,
            currency: 'USD',
          },
        };
        const weekTransactionHistory = {
          '2': [
            {
              date: new Date('2016-02-23T00:00:00.000Z'),
              userId: 2,
              amount: 30000.00,
            },
          ],
        };
        const result = getCommissionFeeCashOutNatural(
          allowedCurrencies,
          weekTransactionHistory,
          transaction,
          config,
        );

        expect(result).toEqual('Invalid Cash Out(Natural) transaction.');
      });
    });

    describe('Cash Out for Legal Persons', () => {
      const config = {
        percents: 0.3,
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
      };

      describe('Compute Cash Out Juridical Commission Fee', () => {
        const {
          percents,
          min: { amount: minAmount },
        } = config;

        it('Commission fee should be 0.50 given the amount 0.00', () => {
          const amount = 0.00;
          const result = computeCommissionFeeCashOutJuridical(amount, percents, minAmount);

          expect(result).toEqual('0.50');
        });
        it('Commission fee should be 0.50 given the amount 10.00 (less than the minimum allowed commission fee)', () => {
          const amount = 10.00;
          const result = computeCommissionFeeCashOutJuridical(amount, percents, minAmount);

          expect(result).toEqual('0.50');
        });
        it('Commission fee should be 0.50 given the amount 5.00 (less than the minimum allowed commission fee)', () => {
          const amount = 5.00;
          const result = computeCommissionFeeCashOutJuridical(amount, percents, minAmount);

          expect(result).toEqual('0.50');
        });
        it('Commission fee should be 10.20 given the amount 3400.00 (greater than the minimum allowed commission fee)', () => {
          const amount = 3400.00;
          const result = computeCommissionFeeCashOutJuridical(amount, percents, minAmount);

          expect(result).toEqual('10.20');
        });
        it('Commission fee should be 5.40 given the amount 1800.00 (greater than the minimum allowed commission fee)', () => {
          const amount = 1800.00;
          const result = computeCommissionFeeCashOutJuridical(amount, percents, minAmount);

          expect(result).toEqual('5.40');
        });
      });

      describe('Get Cash Out Commission Fee', () => {
        it('Should get the computed commission fee', () => {
          const transaction = {
            date: '2016-01-10',
            user_id: 2,
            user_type: 'juridical',
            type: 'cash_out',
            operation: {
              amount: 10.00,
              currency: 'EUR',
            },
          };
          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            config,
          );

          expect(result).toEqual('0.50');
        });
        it('Should block invalid transaction type', () => {
          const transaction = {
            date: '2016-01-12',
            user_id: 1,
            user_type: 'juridical',
            type: 'cash_in',
            operation: {
              amount: 10.00,
              currency: 'EUR',
            },
          };
          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            config,
          );

          expect(result).toEqual('Invalid Cash Out(Juridical) transaction.');
        });
        it('Should block invalid user type', () => {
          const transaction = {
            date: '2016-01-12',
            user_id: 1,
            user_type: 'natural',
            type: 'cash_out',
            operation: {
              amount: 10.00,
              currency: 'EUR',
            },
          };
          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            config,
          );

          expect(result).toEqual('Invalid Cash Out(Juridical) transaction.');
        });
        it('Should block invalid transaction currency', () => {
          const transaction = {
            date: '2016-01-12',
            user_id: 1,
            user_type: 'natural',
            type: 'cash_in',
            operation: {
              amount: 10.00,
              currency: 'PHP',
            },
          };
          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            config,
          );

          expect(result).toEqual('Invalid Cash Out(Juridical) transaction.');
        });
        it('Should block invalid config currency', () => {
          const transaction = {
            date: '2016-01-12',
            user_id: 1,
            user_type: 'natural',
            type: 'cash_in',
            operation: {
              amount: 10.00,
              currency: 'EUR',
            },
          };
          const clonedConfig = { ...config };
          clonedConfig.min.currency = 'PHP';

          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            clonedConfig,
          );

          expect(result).toEqual('Invalid Cash Out(Juridical) transaction.');
        });
        it('Should block different currencies for transaction and config', () => {
          const transaction = {
            date: '2016-01-12',
            user_id: 1,
            user_type: 'natural',
            type: 'cash_in',
            operation: {
              amount: 10.00,
              currency: 'USD',
            },
          };

          const result = getCommissionFeeCashOutJuridical(
            allowedCurrencies,
            transaction,
            config,
          );

          expect(result).toEqual('Invalid Cash Out(Juridical) transaction.');
        });
      });
    });
  });

  describe('Get Cash Out Commission Fee for Natural or Juridical Person', () => {
    const configCashOutNatural = {
      percents: 0.3,
      week_limit: {
        amount: 1000,
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

    it('Should get cash out commission fee for Natural Person', () => {
      const transaction = {
        date: '2016-02-23',
        user_id: 2,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 30000.00,
          currency: 'EUR',
        },
      };
      const weekTransactionHistory = {
        '2': [
          {
            date: new Date('2016-02-23T00:00:00.000Z'),
            userId: 2,
            amount: 30000.00,
          },
        ],
      };
      const { user_type: userType } = transaction;
      const result = getCommissionFeeCashOut(
        userType,
        allowedCurrencies,
        transaction,
        configCashOutNatural,
        weekTransactionHistory,
      );

      expect(result).toEqual('90.00');
    });
    it('Should get cash out commission fee for Juridical Person', () => {
      const transaction = {
        date: '2016-01-10',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: {
          amount: 10.00,
          currency: 'EUR',
        },
      };
      const { user_type: userType } = transaction;
      const result = getCommissionFeeCashOut(
        userType,
        allowedCurrencies,
        transaction,
        configCashOutJuridical,
      );

      expect(result).toEqual('0.50');
    });
    it('Should return invalid user type', () => {
      const transaction = {
        date: '2016-01-10',
        user_id: 2,
        user_type: 'legal',
        type: 'cash_out',
        operation: {
          amount: 10.00,
          currency: 'EUR',
        },
      };
      const { user_type: userType } = transaction;
      const result = getCommissionFeeCashOut(
        userType,
        allowedCurrencies,
        transaction,
        configCashOutJuridical,
      );

      expect(result).toEqual('Invalid user type \'legal\'');
    });
  });
});
