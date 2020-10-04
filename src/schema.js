const Joi = require('joi');

const schemaOperation = Joi.object().keys({
  amount: Joi.number().required(),
  currency: Joi.string().valid('EUR').required(),
});

const schemaTransaction = Joi.object().keys({
  date: Joi.date().required(),
  user_id: Joi.number().required(),
  user_type: Joi.string().required(),
  type: Joi.string().required().valid('cash_in', 'cash_out').required(),
  operation: schemaOperation,
});

module.exports = {
  schemaTransaction,
};
