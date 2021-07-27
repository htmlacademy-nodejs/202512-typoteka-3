const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;
const MAX_SYMBOLS_FILENAME = 10;
const path = require(`path`);

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

class FileStorageService {
  constructor() {
    this.storage = multer.diskStorage({
      destination: uploadDirAbsolute,
      filename: (req, file, cb) => {
        const uniqueName = nanoid(MAX_SYMBOLS_FILENAME);
        const extension = file.originalname.split(`.`).pop();
        cb(null, `${uniqueName}.${extension}`);
      }
    });

    this.upload = multer({storage: this.storage});
  }

  getSingleUploadFn() {
    return this.upload.single(`upload`);
  }
}

module.exports = FileStorageService;
