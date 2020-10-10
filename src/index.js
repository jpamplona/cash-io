/* eslint-disable no-nested-ternary */
import {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
  validateConfigurations,
} from './controllers/config';
import { read } from './controllers/file';
import { getCommissionFeeCashIn } from './controllers/cash-in';
import {
  getCommissionFeeCashOut,
} from './controllers/cash-out';
import { isValidTransaction } from './controllers/transaction';

// eslint-disable-next-line import/prefer-default-export
export const execute = (file) => {
  const allowedCurrencies = ['EUR'];

  const start = async () => {
    try {
      // load cash in and cash out configurations
      const [
        configCashIn,
        configCashOutNatural,
        configCashOutJuridical,
      ] = await Promise.all([
        getCashInConfig,
        getCashOutNaturalConfig,
        getCashOutJuridicalConfig,
      ]);

      // validate cash in and cash out configurations before processing transactions
      validateConfigurations(
        configCashIn,
        configCashOutNatural,
        configCashOutJuridical,
      );

      // read input file
      const transactions = await read(file);

      const weekTransactionHistory = {};

      const processedTransactions = transactions.map((transaction) => {
        // check if transaction is valid before processing
        if (isValidTransaction(transaction)) {
          const { type: transactionType, user_type: userType } = transaction;
          const isNaturalUser = userType === 'natural';

          return transactionType === 'cash_in'
            ? getCommissionFeeCashIn(
              allowedCurrencies,
              transaction,
              configCashIn,
            )
            : transactionType === 'cash_out'
              ? getCommissionFeeCashOut(
                userType,
                allowedCurrencies,
                transaction,
                isNaturalUser
                  ? configCashOutNatural
                  : configCashOutJuridical,
                isNaturalUser
                  ? weekTransactionHistory
                  : null,
              )
              : `Invalid transaction type ${transactionType}`;
        }
        return 'Invalid transaction';
      });

      // single output place for processed transactions
      console.log(processedTransactions.join('\n'));
      return processedTransactions;
    } catch (e) {
      console.log(e.message);
      return e;
    }
  };

  start();
};
