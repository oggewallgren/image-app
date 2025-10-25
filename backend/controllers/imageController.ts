import { NextFunction, Request, Response } from "express";

import multer from "multer";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMG_DIRECTORY_PATH = "public/img";

// Ensure output directory exists
if (!fs.existsSync(IMG_DIRECTORY_PATH)) {
  fs.mkdirSync(IMG_DIRECTORY_PATH, { recursive: true });
}

// Multer setup: keep file in memory for processing
const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPEG files are allowed"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const getAllImages = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const data = await ImageMetadataModel.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

export const uploadImage = upload.single("photo");

export const validateImageName = (req: Request, res: Response, next: NextFunction) => {
  const raw = (req.body.name || "").toString();
  // Expect full filename: <first-10>_<YYYYMMDDHHmmss>.(png|jpg|jpeg)
  const match = /^([a-z0-9-]{1,10})_(\d{14})\.(png|jpe?g)$/i.exec(raw);
  if (!match) {
    return res.status(400).json({
      status: "fail",
      message:
        "Invalid name. Must match <10 letters/numbers/dashes>_<14-digit timestamp>.(png|jpg|jpeg)",
    });
  }
  const extInput = match[3].toLowerCase();

  // Ensure mimetype matches extension
  if (!req.file) {
    return res.status(400).json({ status: "fail", message: "No file uploaded" });
  }
  if (req.file.mimetype.split("/")[1] !== extInput) {
    return res.status(400).json({
      status: "fail",
      message: "File extension does not match uploaded file type",
    });
  }
  next();
};

export const processAndSaveImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "No file uploaded" });
    }

    const outPath = path.join(IMG_DIRECTORY_PATH, req.body.name);

    let pipeline = sharp(req.file.buffer).resize(400, 400, {
      fit: "cover",
      position: "center",
    });
    const extension = req.file.mimetype.split("/")[1];
    pipeline = extension === "png" ? pipeline.png() : pipeline.jpeg({ mozjpeg: true });

    await pipeline.toFile(outPath);

    next();
  } catch (err) {
    next(err);
  }
};

export const createImageMetadata = async (req: Request, res: Response, next: NextFunction) => {
  const doc = await ImageMetadataModel.create({
    name: req.body.name,
    path: `/img/${req.body.name}`,
  });

  if (!doc) {
    return res.status(400).json({
      status: "fail",
      message: "invalid input",
    });
  }

  return res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};
