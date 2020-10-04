const computeCommissionFeeCashIn = (amount, commissionPercent, commissionMaxAmount) => {
  const commissionPercentRate = commissionPercent / 100;
  let commissionFee = amount * commissionPercentRate;

  // set maximum commission fee if the computed commission fee exceeds to maximum amount
  commissionFee = (commissionFee > commissionMaxAmount)
    ? commissionMaxAmount
    : commissionFee;

  return commissionFee.toFixed(2);
};

const getCommissionFeeCashIn = (
  allowedCurrencies,
  {
    type,
    operation: { currency: operationCurrency, amount: operationAmount },
  },
  {
    percents,
    max: { currency: configCurrency, amount: configMaxAmount },
  },
) => (
  (
    type === 'cash_in'
    && allowedCurrencies.includes(operationCurrency)
    && allowedCurrencies.includes(configCurrency)
    && operationCurrency === configCurrency
  )
    ? computeCommissionFeeCashIn(operationAmount, percents, configMaxAmount)
    : 'Invalid Cash In transaction.');

module.exports = {
  computeCommissionFeeCashIn,
  getCommissionFeeCashIn,
};
