import dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/jfif": "jfif",
  "image/gif": "gif",
};

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRECT_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
});

// upload file to S3
export const uploadToS3 = async (file) => {
  const uuidName = uuidv4() + "." + MIME_TYPE_MAP[file.mimetype];

  const uploadObjParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer,
    Key: uuidName,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadObjParams);
  await s3.send(command);

  return uuidName;
};

// get file from S3
export const getFileFromS3 = async (fileName) =>
  "https://taichung-ticktock.s3.ap-northeast-1.amazonaws.com/" + fileName;

// delete file from S3
export const deleteFileFromS3 = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};
