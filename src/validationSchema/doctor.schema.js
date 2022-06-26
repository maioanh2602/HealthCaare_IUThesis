const Joi = require('joi')

const doctorCalendarSchema = Joi.object().keys({
    id: Joi.string().optional().allow(''),
    date: Joi.array().required(),
    time: Joi.array().required(),
    // month: Joi.string().optional(),
});


const doctorLoadCalendarSchema = Joi.object().keys({
    doctorID: Joi.string().required(),
    month: Joi.number().optional()
});

const doctorLoadCalendarOfMonth = Joi.object().keys({
    month: Joi.number().required()
});

const doctorGetAvailableDateSchema = Joi.object().keys({
    doctorID: Joi.string().required(),
});

const doctorGetAvailableTimeSchema = Joi.object().keys({
    doctorID: Joi.string().required(),
    date: Joi.string().required(),
});

const doctorRateSchema = Joi.object().keys({
    doctorID: Joi.string().required(),
    stars: Joi.number().required().min(1).max(5)
});

const doctorGetRateSchema = Joi.object().keys({
    doctorID: Joi.string().required()
})
module.exports = {
    doctorCalendarSchema,
    doctorLoadCalendarSchema,
    doctorLoadCalendarOfMonth,
    doctorGetAvailableDateSchema,
    doctorGetAvailableTimeSchema,
    doctorRateSchema,
    doctorGetRateSchema
};