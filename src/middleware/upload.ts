import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  const mimetAypeIsValid = allowedMimeTypes.includes(file.mimetype);
  const extensionIsValid = [".jpg", ".jpeg", ".png", ".JPG"].some((ext) =>
    file.originalname.endsWith(ext)
  );
  if (mimetAypeIsValid && extensionIsValid) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image file (jpg, jpeg, png, gif)."));
  }
};

const storage = multer.diskStorage({
  destination: (_: Request, file: Express.Multer.File, cb) => {
    const dir = path.join(process.cwd(),"dist/src/assets/uploads/");

    // Create the uploads directory if it does not exist
    if (!fs.existsSync(dir)) {
      console.log("Creating uploads directory");
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_: Request, file: Express.Multer.File, cb) => {
    const randomStr = Math.random().toString(36).substr(2, 5);
    cb(null, `${Date.now()}-${randomStr}-image-${file.originalname}`);
  },
});

const setupMulter = () => {
  const uploadFile = multer({ storage, fileFilter: imageFilter });
  return uploadFile;
};

export default setupMulter();
