const express = require("express");


const validationMiddleware = require("../middlewares/validation");
const { authorize } = require("../middlewares/authorize");
const { doctorCalendarSchema, doctorLoadCalendarSchema, doctorGetAvailableDateSchema, doctorGetAvailableTimeSchema, doctorRateSchema, doctorGetRateSchema } = require("../validationSchema/doctor.schema");
const doctorController = require("../controllers/doctor.controller");
const router = express.Router();

router.post("/set-calendar", validationMiddleware(doctorCalendarSchema), authorize('doctor'), doctorController.setCalendar);
router.post("/get-calendar", validationMiddleware(doctorLoadCalendarSchema), doctorController.getCalendar);
// router.post("/get-all-calendar", validationMiddleware(doctorLoadCalendarOfMonth, doctorController.doctorLoadCalendarOfMonth))
router.post("/get-available-date", validationMiddleware(doctorGetAvailableDateSchema), authorize(), doctorController.getAvailableDate);
router.post("/get-available-time", validationMiddleware(doctorGetAvailableTimeSchema), authorize(), doctorController.getAvailableTime);
router.post("/rate",validationMiddleware(doctorRateSchema), authorize(), doctorController.rateDoctor);
router.post("/get-rate", validationMiddleware(doctorGetRateSchema), authorize(), doctorController.getRating);

// router.post("/get-doctor",  doctorController.getDoctor);
module.exports = router;