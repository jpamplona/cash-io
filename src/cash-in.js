const computeCommissionFee = (amount, commissionPercent, commissionMaxAmount) => {
  const commissionPercentRate = commissionPercent / 100;
  let commissionFee = amount * commissionPercentRate;

  // set maximum commission fee if the computed commission fee exceeds to maximum amount
  commissionFee = (commissionFee > commissionMaxAmount)
    ? commissionMaxAmount
    : commissionFee;

  return commissionFee.toFixed(2);
};

const getCommission = (
  allowedCurrencies,
  {
    type,
    operation: { currency: operationCurrency, amount: operationAmount },
  },
  {
    percents,
    max: { currency: configCurrency, amount: configMaxAmount },
  },
) => {
  if (
    type === 'cash_in'
    && allowedCurrencies.includes(operationCurrency)
    && allowedCurrencies.includes(configCurrency)
    && operationCurrency === configCurrency
  ) {
    return computeCommissionFee(operationAmount, percents, configMaxAmount);
  }

  return 'Invalid Cash In transaction.';
};

module.exports = {
  computeCommissionFee,
  getCommission,
};
