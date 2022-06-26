import mongoose from 'mongoose';

const { to } = require('await-to-js');
const { AppointmentModel, UserModel, DoctorCalenderModel, ChatRoomModel } = require('../models');
export const updateAppointment = async (data, userID) => {
  const { appointmentID, doctorID } = data;
  delete data["appointmentID"];
  data["updatedBy"] = userID;
  const [, appointmentDetails] = await to(AppointmentModel.findOne({ _id: appointmentID }).lean());
  if (appointmentDetails) {
    const { doctorID, date, time } = appointmentDetails;
    await to(DoctorCalenderModel.updateOne({ doctorID, date, time }, {
      $set: {
        status: true
      }
    }));

  }
  const [err,] = await to(AppointmentModel.findByIdAndUpdate(appointmentID, data));
  await to(DoctorCalenderModel.updateOne({ doctorID, date: data.date, time: data.time }, { $set: { status: false } }));
  if (err) {
    throw err
  }
  return appointmentID
}

export const deleteAppointment = async (data, userID) => {
  const { appointmentID } = data;

  const [err,] = await to(AppointmentModel.findByIdAndUpdate(appointmentID, { active: false, updatedBy: userID }));
  const [, appointmentDetails] = await to(AppointmentModel.findOne({ _id: appointmentID }).lean());
  if (appointmentDetails) {
    const { doctorID, date, time } = appointmentDetails;
    await to(DoctorCalenderModel.updateOne({ doctorID, date: date, time }, { $set: { status: true } }));

  }
  if (err) {
    throw err;
  }
  return appointmentID;
}

export const createAppointment = async (data, userID) => {
  const [err, result] = await to(new AppointmentModel({ createdBy: userID, ...data }).save());
  if (err) {
    throw err;
  }
  return result
}

export const getDetails = async (data) => {
  const [err, result] = await to(AppointmentModel.findById(data.appointmentID).lean());
  if (err) {
    throw err;
  }
  if (result) {

    const { doctorID } = result;
    const [, doctorDetails] = await to(UserModel.findById(doctorID).lean());
    if (doctorDetails) {
      result.doctorDetails = doctorDetails;
    }
    return result
  }

}

export const getAll = async (data) => {
  const { userID } = data;
  const [, userDetails] = await to(UserModel.findById(userID).lean());

  const currentPage = data.body.currentPage || 1
  const recordPerPage = data.body.recordPerPage || 10
  const skip = (currentPage - 1) * recordPerPage;
  let err, result, totalPages
  if (userDetails && userDetails.role === "doctor") {
    [err, result] = await to(AppointmentModel.find({ doctorID: userID, active: true }).skip(skip).limit(recordPerPage).lean());
    [, totalPages] = await to(AppointmentModel.find({ doctorID: userID, active: true }).countDocuments());
  } else if (userDetails && userDetails.role === "patient") {

    [err, result] = await to(AppointmentModel.find({ createdBy: userID, active: true }).sort({ _id: -1 }).skip(skip).limit(recordPerPage).lean());
    [, totalPages] = await to(AppointmentModel.find({ createdBy: userID, active: true }).countDocuments());
    if (result) {
      for (let obj of result) {
        const { doctorID } = obj;
        const [, doctorDetails] = await to(UserModel.findById(doctorID).lean());
        if (doctorDetails) {
          obj.firstName = doctorDetails.firstName;
          obj.lastName = doctorDetails.lastName;
          obj.cover = doctorDetails.cover;
          obj.email = doctorDetails.email;
        }
      }
    }
    return { result, totalPages }
  } else {
    [, result] = await to(AppointmentModel.find({ active: true }).sort({ _id: -1 }).skip(skip).limit(recordPerPage).lean());
    [, totalPages] = await to(AppointmentModel.find({ active: true }).countDocuments());
    if (result) {
      for (let obj of result) {
        const { doctorID } = obj;
        const [, doctorDetails] = await to(UserModel.findById(doctorID).lean());
        if (doctorDetails) {
          const { firstName, lastName } = doctorDetails;
          obj.doctorName = firstName + ' ' + lastName
          obj.cover = doctorDetails.cover;
        }
      }
      for (let obj of result) {
        const { createdBy } = obj;
        const [, details] = await to(UserModel.findById(createdBy).lean());

        if (details) {
          obj.patientName = details.firstName + ' ' + details.lastName;
        }
      }
    }
    return {
      result,
      totalPages
    }

  }
  if (err) {
    throw err;
  }
  if (result) {
    for (let obj of result) {
      const { createdBy } = obj;
      const [, details] = await to(UserModel.findById(createdBy).lean());

      if (details) {
        obj.firstName = details.firstName;
        obj.lastName = details.lastName;
        obj.email = details.email;
      }
    }
  }

  const response = {
    result,
    totalPages
  }
  return response;
}

export const deleteAppointments = async (data) => {
  const { userID } = data;
  const { appointmentIDs } = data.body;
  let objectIDs = appointmentIDs.map(id => mongoose.Types.ObjectId(id))
  const query = {
    _id: {
      $in: objectIDs
    },
    active: true,
    createdBy: userID
  }
  const updateData = {
    $set: {
      active: false
    }
  }

  const [err, result] = await to(AppointmentModel.updateMany(query, updateData))
  if (err) {
    throw err
  }
  return result


}

export const checkAppointment = async (data) => {
  const { roomID } = data;
  const [, participants] = await to(ChatRoomModel.getParticipants(roomID));
  let chatUser = participants.map(participant => participant)
  console.log(participants)
  

  const [err, result] = await to(AppointmentModel.findOne({ createdBy:  {
    $in: chatUser
  }, doctorID: {$in: chatUser}, active: true }).lean());
  if (err) {
    throw err;
  }
  if (result) {
    return {
      isPaid: true
    }

  }
  return {
    isPaid: false
  }

}