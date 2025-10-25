import mongoose, { Document, Schema } from "mongoose";

export interface IImageMetadata extends Document {
  name: string;
  path: string;
}

const imageMetadataSchema = new Schema<IImageMetadata>(
  {
    name: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  { collection: "imageMetadata" }
);

export const ImageMetadataModel = mongoose.model<IImageMetadata>(
  "ImageMetadata",
  imageMetadataSchema
);
