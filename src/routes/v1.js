const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "meninblack",
  api_key: "628859418171812",
  api_secret: "-5GkYx6dzEknvZ0Pnq-yhrW9fLU",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ui-health",
  },
});
const upload = multer({ storage: storage });


const router = express.Router();
const userRoutes = require('../routes/user.route');
const postRoutes = require('../routes/post.route');
const roomRoutes = require('../routes/room.route');
const appointmentRoutes = require('../routes/appointment.route');
const doctorRoutes = require('../routes/doctor.route');
const { handleSuccess } = require("../services/utils.service");


router.use('/', userRoutes);
router.use('/post/', postRoutes);
router.use('/appointment/', appointmentRoutes);
router.use('/doctor', doctorRoutes);
router.use('/room/', roomRoutes);

router.post("/image-upload", upload.single('image'), async (req, res) => {
  return handleSuccess(res, {
    link: req.file.path
  })
});

module.exports = router;
