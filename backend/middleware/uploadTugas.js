const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/tugas");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadTugas = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024,
    files: 2000,
  },
});

module.exports = uploadTugas;
