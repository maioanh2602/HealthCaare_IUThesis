const { handleSuccess, handleError } = require('../services/utils.service');
const { to } = require('await-to-js');
const moment = require('moment');
const { DoctorCalenderModel, RateModel } = require('../models');
const userServices = require('../services/user.services');


export const setCalendar = async (req, res) => {
    const { userID } = req;
    const { id } = req.body
    let err, result;
    const month = moment(req.body.date[0]).startOf('month').toString();
    let dateData = []
    let timeData = []
    try {
        for (let day of req.body.date) {
            dateData.push({
                date: day,
                doctorID: userID,
                createdBy: userID,
                month
            })
        }

        for (let t of req.body.time) {
            for (let day of dateData) {
                timeData.push({
                    ...day,
                    time: t
                })
            }
        }

    } catch (error) {
        console.log("err: ", err)

    }
    if (id) {
        [err,] = await to(DoctorCalenderModel.deleteMany({ doctorID: id, month }));
    }
    [err, result] = await to(DoctorCalenderModel.insertMany(timeData));
    if (err) {
        return handleError(res, err);
    }
    return handleSuccess(res, result);


}

export const getCalendar = async (req, res) => {
    const { doctorID, month } = req.body;
    let startOfMonth = moment([new Date().getFullYear(), month]).startOf('month').toString();

    const pipeline =
        [
            {
                $match: {
                    doctorID: doctorID,
                    month: startOfMonth
                }
            }, {
                $sort: {
                    date: -1

                }
            },
            {
                $group: {
                    _id: {
                        doctorID: "$doctorID",

                    },
                    date: {
                        $addToSet: "$date"

                    },
                    time: {
                        $addToSet: "$time"

                    }


                }
            }
        ]

    const [err, result] = await to(DoctorCalenderModel.aggregate(pipeline));

    if (err) {
        return handleError(res, err)
    }
    if (result && result[0]) {
        result[0].time = result[0].time.sort();
        result[0]._id = result[0]._id.doctorID;
    }
    return handleSuccess(res, result);
}


export const getAvailableDate = async (req, res) => {
    const { doctorID } = req.body;
    const startOfMonth = moment(new Date()).startOf('month').toString();

    const [err, appointments] = await to(DoctorCalenderModel.aggregate([{
        $match: {
            doctorID,
            month: startOfMonth,
            active: true
        },

    },
    {
        $group: {
            _id: "$doctorID",
            date: {
                $addToSet: "$date"
            }

        }
    }
    ]));


    if (err) {
        return handleError(res, err)
    }
    return handleSuccess(res, appointments);
}

export const getAvailableTime = async (req, res) => {
    const { doctorID, date } = req.body;
    const startOfMonth = moment(new Date()).startOf('month').toString();

    const [err, availableTime] = await to(DoctorCalenderModel.aggregate([{
        $match: {
            doctorID: doctorID,
            date: date,
            month: startOfMonth,
            active: true,
            status: true
        }

    }, {
        $group: {
            _id: "$doctorID",
            time: {
                $addToSet: {
                    time: "$time",
                    status: true
                }

            }
        }
    }
    ]));
    const [, unavailableTime] = await to(DoctorCalenderModel.aggregate([{
        $match: {
            doctorID: doctorID,
            date: date,
            month: startOfMonth,
            active: true,
            status: false
        }

    }, {
        $group: {
            _id: "$doctorID",
            time: {
                $addToSet: {
                    time: "$time",
                    status: false
                }

            }
        }
    }
    ]));
    


    if (err) {
        return handleError(res, err)
    }
    if (availableTime.length && unavailableTime.length) {
        availableTime[0].time = availableTime[0].time.concat(unavailableTime[0].time)
        return handleSuccess(res, availableTime);
    }
    return handleSuccess(res, availableTime);

}


export const rateDoctor = async (req, res) => {
    const { doctorID, stars } = req.body;
    const rate = new RateModel({doctorID, stars});
    
    const [err, result] = await to(rate.save());
    if (err) {
        return handleError(res, err)
    }
    return handleSuccess(res, result);
}

export const getRating = async(req, res) => {
    const { doctorID } = req.body
    const [err, result] = await to(userServices.getRating(doctorID));
    
    if (err) {
        return handleError(res, err)
    }
    return handleSuccess(res, result);
}