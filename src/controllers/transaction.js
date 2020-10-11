/* eslint-disable no-param-reassign */
import {
  parse, isSameWeek, isSameYear, format,
} from 'date-fns';
import { schemaTransaction } from '../schema';

export const addToWeekTransactionHistory = (
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

  const currentUserTransactionHistory = weekTransactionHistory[userId];

  if (currentUserTransactionHistory && currentUserTransactionHistory.length > 0) {
    const firstDateInWeek = currentUserTransactionHistory[0].date;

    // check if the current transaction's date is the same with firstDateInWeek
    if (isSameWeek(
      firstDateInWeek,
      parsedDate,
      { weekStartsOn: 1 },
    ) && isSameYear(
      firstDateInWeek,
      parsedDate,
    )) {
      weekTransactionHistory[userId] = [
        ...currentUserTransactionHistory,
        transaction,
      ];
    } else {
      weekTransactionHistory[userId] = [transaction];
    }
  } else {
    weekTransactionHistory[userId] = [transaction];
  }
};

export const isValidTransaction = (transaction) => {
  const dateToday = format(new Date(), 'yyyy-MM-dd');
  const { error } = schemaTransaction.validate(transaction);

  return (transaction.date <= dateToday) && !error;
};
