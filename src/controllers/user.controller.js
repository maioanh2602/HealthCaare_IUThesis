import { UserModel } from '../models';
import * as userServices from '../services/user.services';

const { handleSuccess, handleError } = require('../services/utils.service');
const { CONFIG } = require('../config');
const { to } = require('await-to-js');


export const register = async (req, res) => {
  const body = req.body;
  const [err, result] = await to(userServices.register(body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const login = async (req, res) => {
  const [err, user] = await to(userServices.login(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, user)
}

export const update = async (req, res) => {
  const [err, user] = await to(userServices.update(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, user);
}


export const getDetails = async (req, res) => {
  const [err, data] = await to(userServices.getDetails(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);
}


export const imageUpload = async (req, res) => {
  const ROOTPATH = CONFIG.ROOT_PATH;
  const imageUrl = ROOTPATH + req.file.path;
  return handleSuccess(res, imageUrl)
}


export const updatePassword = async (req, res) => {
  const [err,] = await to(userServices.updatePassword(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, "success");
}

export const getAll = async (req, res) => {
  const [err, result] = await to(userServices.getAll(req));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const createUser = async (req, res) => {
  const [err, result] = await to(userServices.createUser(req))
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const deleteUser = async (req, res) => {
  const [err, result] = await to(userServices.deleteUser(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result)
}

export const getById = async (req, res) => {
  const [err, result] = await to(userServices.getById(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result)
}

export const updateById = async (req, res) => {
  const [err, result] = await to(userServices.updateById(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}
export const deleteMany = async (req, res) => {
  const [err, result] = await to(userServices.deleteMany(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const getDoctors = async (req, res) => {
  const [err, result] = await to(userServices.getDoctors());
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result)
}

export const updateDoctorRate = async (req, res) => {
  const [err, result] = await to(userServices.updateDoctorRate(req.body));
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, result);
}

export const getSpecialists = async (req, res) => {
  const data = ['Tim mach', 'Phu khoa', 'Nha khoa']
  return handleSuccess(res, data);

}


export const getUserOnline = async (req, res) => {
  const [err, data] = await to(UserModel.getUserOnline());
  if (err) {
    return handleError(res, err);
  }
  return handleSuccess(res, data);

}