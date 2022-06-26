const mongoose = require('mongoose');
const Schema = mongoose.Schema

const doctorCalender = new Schema({
    doctorID: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    month: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

doctorCalender.statics.checkDoctorCalender = async function (doctorID) {
    const calendar = await this.findOne({
        doctorID: doctorID,
        createdAt: {
            $gte: new Date(),
            $lt: new Date()
        }
    });
    if (calendar) {
        throw new Error("Can not create. Please update")
    }
    return true;
}


module.exports = {
    doctorCalender
}