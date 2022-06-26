const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {to} = require('await-to-js');

export const appointmentSchema = new Schema({
  description: {
    type: String,
  },
  doctorID: {
    type: String,
    require: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    require: true
  },
  updatedBy: {
    type: String,
  },
  month: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

appointmentSchema.statics.checkDuplicate = async function (doctorID, date, time) {
  const [err, result] = await to(this.findOne({doctorID, date, time, active: true}));
  if (err) {
    throw err;
  }
  
  if (result) {
    throw new Error("Appointment already exists");
  }
}