import Joi from 'joi';

export const schemaOperation = Joi.object().keys({
  amount: Joi.number().required(),
  currency: Joi.string().valid('EUR').required(),
});

export const schemaTransaction = Joi.object().keys({
  date: Joi.date().required(),
  user_id: Joi.number().required(),
  user_type: Joi.string().valid('natural', 'juridical').required(),
  type: Joi.string().required().valid('cash_in', 'cash_out').required(),
  operation: schemaOperation,
});

export const schemaCommissionLimit = {
  amount: Joi.number().required(),
  currency: Joi.string().valid('EUR').required(),
};

export const schemaCashInConfig = Joi.object().keys({
  percents: Joi.number().required(),
  max: schemaCommissionLimit,
});

export const schemaCashOutNaturalConfig = Joi.object().keys({
  percents: Joi.number().required(),
  week_limit: schemaCommissionLimit,
});

export const schemaCashOutJuridicalConfig = Joi.object().keys({
  percents: Joi.number().required(),
  min: schemaCommissionLimit,
});
