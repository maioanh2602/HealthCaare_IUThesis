const multer = require('multer');
const filter = (req, file, cb) => {
  cb(null, true);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/resource/static/assets/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-image-${file.originalName}`)
  }
})

const uploadImage = multer({
  storage,
  filter
})


module.export = {
  uploadImage
}