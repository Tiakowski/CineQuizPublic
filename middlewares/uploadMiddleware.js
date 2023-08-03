const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const filename = `${req.userId}-${file.originalname}`;
    cb(null, filename);
  }
});

const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;
