const express = require("express");
const userController = require("../controllers/user.controller");
const appointmentController = require("../controllers/appointment.controller");


const validationMiddleware = require("../middlewares/validation");
const {authorize} = require("../middlewares/authorize");
const router = express.Router();
const {
  appointmentSchema, appointmentUpdateSchema, appointmentDeleteSchema, appointmentDeleteMutipleSchema, checkAppointmentSchema
} = require("../validationSchema/appointment.schema");

router.post("/create", validationMiddleware(appointmentSchema), authorize(), appointmentController.createAppointment);
router.post("/get-details", appointmentController.getDetails); 
router.post("/get-all", authorize(), appointmentController.getAll) 
router.post("/update", validationMiddleware(appointmentUpdateSchema), authorize(), appointmentController.updateAppointment);
router.post("/delete", validationMiddleware(appointmentDeleteSchema), authorize(), appointmentController.deleteAppointment);
router.post("/delete-multiple", validationMiddleware(appointmentDeleteMutipleSchema), authorize(), appointmentController.deleteAppointments)
router.post("/check", validationMiddleware(checkAppointmentSchema), authorize(), appointmentController.checkAppointment)
module.exports = router;