import multer from "multer";
import path from "path";
import crypto from "crypto";

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "public", "uploads"),
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, path.resolve(__dirname, "..", "..", "public", "uploads"));
    },
    filename: (req: any, file: any, cb: any) => {
      //hash para garatir nome único
      crypto.randomBytes(16, (err: any, hash: any) => {
        if (err) cb(err);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, //2mb
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};
