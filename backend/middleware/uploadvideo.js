const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folder = './uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const videoFilter = (req, file, cb) => {
  const allowedVideoTypes = /mp4|avi|mov|mkv/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  if (allowedVideoTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File video ${file.originalname} tidak didukung.`), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const limits = {
  fileSize: 100 * 1024 * 1024,
};

const uploadEditSesiVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits,
}).single('sesi_video'); 

module.exports = uploadEditSesiVideo;
