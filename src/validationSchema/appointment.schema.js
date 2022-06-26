const Joi = require('joi')
const { CONSTANT } = require('../constants');

const appointmentSchema = Joi.object().keys({
  description: Joi.string().optional().allow(''),
  doctorID: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
});

const appointmentUpdateSchema = Joi.object().keys({
  appointmentID: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  doctorID: Joi.string().optional(),
  date: Joi.string().optional(),
  time: Joi.string().optional(),

});

const appointmentDeleteSchema = Joi.object().keys({
  appointmentID: Joi.string().required()
});

const appointmentDeleteMutipleSchema = Joi.object().keys({
  appointmentIDs: Joi.array().required()
});

const appointmentPaySchema = Joi.object().keys({
  appointmentID: Joi.string().required()
})

const checkAppointmentSchema = Joi.object().keys({
  roomID: Joi.string().required()
})

module.exports = {
  appointmentSchema,
  appointmentDeleteSchema,
  appointmentUpdateSchema,
  appointmentDeleteMutipleSchema,
  checkAppointmentSchema
}