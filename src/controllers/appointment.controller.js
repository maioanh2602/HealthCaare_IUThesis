import mongoose from 'mongoose';
import * as appointmentService from '../services/appointment.service';
const { handleSuccess, handleError } = require('../services/utils.service');
const { AppointmentModel, DoctorCalenderModel } = require('../models');
const moment = require('moment');

const { to } = require('await-to-js');

export const updateAppointment = async (req, res) => {
  const [err,] = await to(appointmentService.updateAppointment(req.body, req.userID));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, "Success")

}

export const deleteAppointment = async (req, res) => {
  const [err,] = await to(appointmentService.deleteAppointment(req.body, req.userID));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, "Success")
}

export const createAppointment = async (req, res) => {

  const { doctorID, date, time } = req.body;
  const month = moment(date).startOf('month').toString();
  req.body.month = month;

  const [err0,] = await to(AppointmentModel.checkDuplicate(doctorID, date, time));
  if (err0) {
    return handleError(res, err0);
  }
  const [err, data] = await to(appointmentService.createAppointment(req.body, req.userID));
  const [err1,] = await to(DoctorCalenderModel.updateOne({ doctorID, date, time, active: true }, { $set: { status: false } }));
  if (err1) {
    return handleError(res, err1)
  }
  if (err) {
    return handleError(res, err)
    // throw err
  }
  return handleSuccess(res, data);
}

export const getDetails = async (req, res) => {
  const [err, data] = await to(appointmentService.getDetails(req.body))
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}

export const getAll = async (req, res) => {
  const [err, data] = await to(appointmentService.getAll(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}

export const deleteAppointments = async (req, res) => {
  const [err, data] = await to(appointmentService.deleteAppointments(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data)
}

export const checkAppointment = async(req, res) => {
  const [err, data] = await to(appointmentService.checkAppointment(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}