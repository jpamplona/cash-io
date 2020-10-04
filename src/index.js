const {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
} = require('./config');
const { read } = require('./file');
const { getCommissionFeeCashIn } = require('./cash-in');
const {
  getCommissionFeeCashOutNatural,
  getCommissionFeeCashOutJuridical,
} = require('./cash-out');
const { addToWeekTransactionHistory } = require('./transaction');

const execute = (file) => {
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

      // read input file
      const transactions = await read(file);

      let weekTransactionHistory = [];

      transactions.forEach((transaction) => {
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
            weekTransactionHistory = addToWeekTransactionHistory(
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
            console.log('Invalid user type');
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

module.exports = { execute };
