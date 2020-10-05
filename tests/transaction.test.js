const { parse } = require('date-fns');
const { addToWeekTransactionHistory, isValidTransaction } = require('../src/controllers/transaction');

describe('Cash In/Out Transaction', () => {
  it('Should be true if the transaction data is valid', () => {
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
    expect(isValidTransaction(transaction)).toBeTruthy();
  });
  it('Should be false if the transaction data is invalid - Invalid date', () => {
    const transaction = {
      date: '2016-13-32',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash_in',
      operation: {
        amount: 2500.00,
        currency: 'EUR',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should be false if the transaction data is invalid - Invalid user_id', () => {
    const transaction = {
      date: '2016-01-12',
      user_id: '57e293a0-e835-45f0-acaf-33f22be023f0',
      user_type: 'juridical',
      type: 'cash_in',
      operation: {
        amount: 2500.00,
        currency: 'EUR',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should be false if the transaction data is invalid - Invalid user_type', () => {
    const transaction = {
      date: '2016-01-12',
      user_id: 1,
      user_type: 'single',
      type: 'cash_in',
      operation: {
        amount: 2500.00,
        currency: 'EUR',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should be false if the transaction data is invalid - Invalid transaction type', () => {
    const transaction = {
      date: '2016-01-12',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash',
      operation: {
        amount: 2500.00,
        currency: 'EUR',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should be false if the transaction data is invalid - Missing operation amount', () => {
    const transaction = {
      date: '2016-01-12',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash_in',
      operation: {
        currency: 'EUR',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should be false if the transaction data is invalid - Invalid operation currency', () => {
    const transaction = {
      date: '2016-01-12',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash_in',
      operation: {
        amount: 2500.00,
        currency: 'USD',
      },
    };
    expect(isValidTransaction(transaction)).toBeFalsy();
  });
  it('Should add transaction to week transaction history - First transaction for the week', () => {
    const weekTransactionHistory = [];
    const transaction = {
      date: '2016-01-05',
      user_id: 2,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 30000.00,
        currency: 'EUR',
      },
    };
    const result = addToWeekTransactionHistory(
      weekTransactionHistory,
      transaction,
    );
    const expectedWeekTransactionHistory = [
      {
        date: parse(
          '2016-01-05',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 30000.00,
      },
    ];
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toEqual(expectedWeekTransactionHistory);
  });
  it('Should add transaction to week transaction history since the transaction date is in the same week', () => {
    const weekTransactionHistory = [
      {
        date: parse(
          '2016-01-05',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 30000.00,
      },
      {
        date: parse(
          '2016-01-06',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 2400.00,
      },
    ];
    const transaction = {
      date: '2016-01-07',
      user_id: 2,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 1000000.00,
        currency: 'EUR',
      },
    };
    const result = addToWeekTransactionHistory(
      weekTransactionHistory,
      transaction,
    );
    const expectedWeekTransactionHistory = [
      {
        date: parse(
          '2016-01-05',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 30000.00,
      },
      {
        date: parse(
          '2016-01-06',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 2400.00,
      },
      {
        date: parse(
          '2016-01-07',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 1000000.00,
      },
    ];
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toEqual(expectedWeekTransactionHistory);
  });
  it('Should add transaction to week transaction history - Different transaction week', () => {
    const weekTransactionHistory = [
      {
        date: parse(
          '2016-01-05',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 30000.00,
      },
      {
        date: parse(
          '2016-01-06',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 2400.00,
      },
    ];
    const transaction = {
      date: '2016-01-18',
      user_id: 2,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 1000000.00,
        currency: 'EUR',
      },
    };
    const result = addToWeekTransactionHistory(
      weekTransactionHistory,
      transaction,
    );
    const expectedWeekTransactionHistory = [
      {
        date: parse(
          '2016-01-18',
          'yyyy-MM-dd',
          new Date(),
        ),
        userId: 2,
        amount: 1000000.00,
      },
    ];
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toEqual(expectedWeekTransactionHistory);
  });
});
