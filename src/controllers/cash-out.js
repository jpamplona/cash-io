export const computeCommissionFeeCashOutNatural = (
  amount,
  commissionPercent,
  weekTransactionHistory,
  weekLimitAmount,
  userId,
) => {
  const commissionPercentRate = commissionPercent / 100;
  let commissionFee = amount * commissionPercentRate;

  const currentUserTransactionHistory = weekTransactionHistory[userId];

  const computedWeekTransactionTotalAmount = currentUserTransactionHistory.reduce(
    (total, transaction) => (total + transaction.amount),
    0,
  );

  const transactionDiff = computedWeekTransactionTotalAmount - weekLimitAmount;

  // provide free charge if exceeded amount is zero or less
  if (transactionDiff <= 0) commissionFee = 0;

  // commission is calculated only from exceeded amount
  if (
    transactionDiff > 0
    && amount > transactionDiff
  ) commissionFee = transactionDiff * commissionPercentRate;

  // normal commission rate
  return commissionFee.toFixed(2);
};

export const getCommissionFeeCashOutNatural = (
  allowedCurrencies,
  weekTransactionHistory,
  {
    type,
    user_id: userId,
    user_type: userType,
    operation: {
      currency: operationCurrency,
      amount: operationAmount,
    },
  },
  {
    percents,
    week_limit: {
      currency: configCurrency,
      amount: configWeekLimitAmount,
    },
  },
) => (
  (
    type === 'cash_out'
    && userType === 'natural'
    && allowedCurrencies.includes(operationCurrency)
    && allowedCurrencies.includes(configCurrency)
    && operationCurrency === configCurrency
  )
    ? computeCommissionFeeCashOutNatural(
      operationAmount,
      percents,
      weekTransactionHistory,
      configWeekLimitAmount,
      userId,
    )
    : 'Invalid Cash Out(Natural) transaction.'
);

export const computeCommissionFeeCashOutJuridical = (
  amount,
  commissionPercent,
  commissionMinAmount,
) => {
  const commissionPercentRate = commissionPercent / 100;
  let commissionFee = amount * commissionPercentRate;

  // set minimum commission fee if the computed commission fee is less than minimum amount
  commissionFee = (commissionFee < commissionMinAmount)
    ? commissionMinAmount
    : commissionFee;

  return commissionFee.toFixed(2);
};

export const getCommissionFeeCashOutJuridical = (
  allowedCurrencies,
  {
    type,
    user_type: userType,
    operation: {
      currency: operationCurrency,
      amount: operationAmount,
    },
  },
  {
    percents,
    min: {
      currency: configCurrency,
      amount: configMinAmount,
    },
  },
) => (
  (
    type === 'cash_out'
    && userType === 'juridical'
    && allowedCurrencies.includes(operationCurrency)
    && allowedCurrencies.includes(configCurrency)
    && operationCurrency === configCurrency
  )
    ? computeCommissionFeeCashOutJuridical(
      operationAmount,
      percents,
      configMinAmount,
    )
    : 'Invalid Cash Out(Juridical) transaction.'
);
