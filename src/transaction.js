const { parse, isSameWeek } = require('date-fns');
const { schemaTransaction } = require('./schema');

const addToWeekTransactionHistory = (
  weekTransactionHistory,
  { user_id: userId, date, operation: { amount } },
) => {
  const parsedDate = parse(
    date,
    'yyyy-MM-dd',
    new Date(),
  );
  const transaction = {
    userId,
    date: parsedDate,
    amount,
  };

  if (weekTransactionHistory.length > 0) {
    const firstDateInWeek = weekTransactionHistory[0].date;

    // check if the current transaction's date is the same with firstDateInWeek
    if (isSameWeek(
      firstDateInWeek,
      parsedDate,
      { weekStartsOn: 1 },
    )) {
      return [
        ...weekTransactionHistory,
        transaction,
      ];
    }
    return [transaction];
  }
  return [transaction];
};

const isValidTransaction = (transaction) => {
  const { error } = schemaTransaction.validate(transaction);
  return !error;
};

module.exports = {
  addToWeekTransactionHistory,
  isValidTransaction,
};
