const express = require("express");
const userController = require("../controllers/user.controller");

const {
  userSchema,
  updateUserSchema,
  userLoginSchema,
  userGetDetails,
  likePostSchema,
  updatePasswordSchema,
  userDeleteSchema,
  deleteUsersSchema,
  updateDoctorRateSchema
} = require("../validationSchema/user.schema");
const validationMiddleware = require("../middlewares/validation");
const {authorize} = require("../middlewares/authorize");
const router = express.Router();


router.post("/register", validationMiddleware(userSchema), userController.register);
router.post("/login", validationMiddleware(userLoginSchema), userController.login);
router.post("/update", validationMiddleware(updateUserSchema), userController.update);
router.post("/user/get-details", authorize(), userController.getDetails);
router.post("/update-password", validationMiddleware(updatePasswordSchema), authorize(), userController.updatePassword);
router.post("/user/get-all", authorize(['admin']), userController.getAll);
router.post("/user/create", validationMiddleware(userSchema),  authorize(['admin']), userController.createUser);
router.post("/user/delete", validationMiddleware(userDeleteSchema), authorize(['admin']), userController.deleteUser);
router.post("/user/get-by-id", validationMiddleware(userDeleteSchema), authorize(['admin']), userController.getById);
router.post("/user/update-by-id", validationMiddleware(updateUserSchema), authorize(['admin']), userController.updateById);
router.post("/user/delete-many", validationMiddleware(deleteUsersSchema), authorize(['admin']), userController.deleteMany);
router.post("/load-doctor", authorize(), userController.getDoctors);
router.post("/rate", validationMiddleware(updateDoctorRateSchema), authorize(), userController.updateDoctorRate);
router.post("/load-specialist", userController.getSpecialists);
router.post("/load-user-online", userController.getUserOnline)
module.exports = router;