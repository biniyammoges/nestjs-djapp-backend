import * as path from 'path';

export class Helper {
  static customName(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.parse(file.originalname).ext;
    const originalName = file.originalname.split('.')[0].replace(/\s/g, '_');
    cb(null, originalName + '-' + uniqueSuffix + fileExtension);
  }

  static dest(req, file, cb) {
    cb(null, `./public/uploads/`);
  }
}
