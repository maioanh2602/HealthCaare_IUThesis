import { CONSTANT } from '../constants';

const mongoose = require('mongoose');
const { ClientError } = require("../errors");
const { to } = require("await-to-js");
const { UserModel, RateModel } = require("../models");
const { hashPassword } = require("../utils/hash");
const { encodeToken } = require("../utils/jwt");

export const register = async (data) => {
  data.password = hashPassword(data.password);
  const [err, result] = await to(new UserModel(data).save());


  if (err) {
    throw err;
  }
  let user = result._doc;
  user = {
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  }
  delete user.password

  return {
    user: user,
    accessToken: encodeToken(result.toObject())
  }

}

export const login = async (payload) => {
  const { password } = payload;
  payload.password = hashPassword(password);

  const query = {
    active: true,
    ...payload,
  }
  let [err, user] = await to(UserModel.findOne(query).lean());
  if (err) {
    throw err;
  }
  if (!user) {
    throw new ClientError("Wrong email or password");
  }
  let accessToken = encodeToken(user);
  user = {
    ...user,
    displayName: `${user.firstName} ${user.lastName}`

  }

  return {
    accessToken,
    user
  };
}

export const update = async (data) => {
  const { id: userID, ...updateData } = data;
  const [err,] = await to(UserModel.findByIdAndUpdate(userID, updateData));

  if (err) {
    throw err
  }
  return data.userID

}

export const getDetails = async (data) => {
  const userID = data.userID;
  const [err, user] = await to(UserModel.findById(userID));

  if (!user) {
    throw new ClientError("User not found");
  }
  if (err) {
    throw err;
  }
  const response = {
    ...user._doc,
    displayName: `${user.firstName} ${user.lastName}`,
    photoUrl: user.cover,

  }
  return response
}


export const updatePassword = async (data) => {
  const { oldPassword, newPassword } = data.body;
  const { userID } = data;
  const [err, user] = await to(UserModel.findOne({ _id: mongoose.Types.ObjectId(userID), active: true, password: hashPassword(oldPassword) }));
  if (!user) {
    throw new ClientError("Password is incorrect");
  }
  const [err2,] = await to(UserModel.findByIdAndUpdate(userID, { password: hashPassword(newPassword) }));
  if (err2) {
    throw err2;
  }
}

export const getAll = async (data) => {
  const { userID } = data;
  const currentPage = data.body.currentPage || 1;
  const recordPerPage = data.body.recordPerPage || 10;
  const skip = (currentPage - 1) * recordPerPage;
  const [err, users] = await to(UserModel.find({ active: true, _id: { $ne: mongoose.Types.ObjectId(userID) } }).skip(skip).limit(recordPerPage).sort({ _id: -1 }).lean());
  const [err1, total] = await to(UserModel.find({ active: true, _id: { $ne: mongoose.Types.ObjectId(userID) } }).count());

  if (err) {
    throw err;
  }
  return {
    users,
    total
  };
}

export const createUser = async (data) => {
  const [err, result] = await to(new UserModel(data.body).save());
  if (err) {
    throw err;
  }
  return result._id;

}

export const deleteUser = async (data) => {
  const { userID } = data;
  const [err,] = await to(UserModel.findByIdAndUpdate(userID, { active: false }));
  if (err) {
    throw err;
  }
  return userID;
}

export const getById = async (data) => {
  const { userID } = data;
  const [err, user] = await to(UserModel.findById(userID).lean());
  if (err) {
    throw err;
  }
  return user;
}

export const updateById = async (data) => {
  const { id, ...updateData } = data;
  if (updateData.password === "" || updateData.password === undefined) {
    delete updateData.password;
  }
  if (updateData && updateData.password) {
    updateData.password = hashPassword(updateData.password);
  }
  const [err,] = await to(UserModel.findByIdAndUpdate(id, updateData));
  if (err) {
    throw err;
  }
  return id
}

export const deleteMany = async (data) => {
  const { userIDs } = data;
  const ids = userIDs.map(id => mongoose.Types.ObjectId(id));

  const [err, result] = await to(UserModel.updateMany({ _id: { $in: ids } }, { active: false }));
  if (err) {
    throw err;
  }
  return result;
}

export const getDoctors = async () => {
  let [err, result] = await to(UserModel.find({
    active: true, $or: [
      { role: CONSTANT.ROLE.DOCTOR },
      { role: 'admin' }
    ]
  }).lean());
  if (err) {
    throw err;
  }
  if (result) {
    var results = await Promise.all(result.map(async (item) => {
      const rates = await getRating(item._id);
      item['fullName'] = item.firstName + ' ' + item.lastName;
      item['rating'] = rates.rating
      return item
  }));
  return results;
  
  }
  // return result
}

export const updateDoctorRate = async (data) => {
  const { userID, rate } = data;

  const [err,] = await to(UserModel.findByIdAndUpdate(userID, { rate }));
  if (err) {
    throw err;
  }
  return userID
}

export const getRating = async (doctorID) => {
  const pipeline = [
    {
      $match: {
        doctorID: doctorID
      }
    }, {
      $group: {
        _id: doctorID,
        rating: { $avg: "$stars" }
      }

    }
  ]
  const [err, result] = await to(RateModel.aggregate(pipeline));
  if (err) {
    throw err;
  }
  if (result.length) {
    return {
      rating: result[0]
    }
  }
  return {
    rating: 0
  }

}