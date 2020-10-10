import {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
  validateConfigurations,
} from './controllers/config';
import { read } from './controllers/file';
import { getCommissionFeeCashIn } from './controllers/cash-in';
import {
  getCommissionFeeCashOutNatural,
  getCommissionFeeCashOutJuridical,
} from './controllers/cash-out';
import { addToWeekTransactionHistory, isValidTransaction } from './controllers/transaction';

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

      transactions.forEach((transaction) => {
        // check if transaction is valid
        if (isValidTransaction(transaction)) {
          const { type: transactionType, user_type: userType } = transaction;

          if (transactionType === 'cash_in') {
            // output computed comission for Cash In
            console.log(
              getCommissionFeeCashIn(
                allowedCurrencies,
                transaction,
                configCashIn,
              ),
            );
          } else if (transactionType === 'cash_out') {
            if (userType === 'natural') {
              // update weekly transaction history
              addToWeekTransactionHistory(
                weekTransactionHistory,
                transaction,
              );

              // output computed comission for Cash Out (Natural)
              console.log(
                getCommissionFeeCashOutNatural(
                  allowedCurrencies,
                  weekTransactionHistory,
                  transaction,
                  configCashOutNatural,
                ),
              );
            } else if (userType === 'juridical') {
              // output computed comission for Cash Out (Juridical)
              console.log(
                getCommissionFeeCashOutJuridical(
                  allowedCurrencies,
                  transaction,
                  configCashOutJuridical,
                ),
              );
            } else {
              console.log(`Invalid user type '${userType}'`);
            }
          } else {
            console.log(`Invalid transaction type ${transactionType}`);
          }
        } else {
          console.log('Invalid transaction');
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  start();
};
