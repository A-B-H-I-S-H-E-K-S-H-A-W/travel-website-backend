import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function FileUploader(image) {
  try {
    const uniqueName =
      Date.now() + Math.floor(Math.random() * 1000000) + "-" + image.name;
    const uploadPath = `./src/public/temp/${uniqueName}`;

    await image.mv(uploadPath);

    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: "uploads", // optional folder in Cloudinary
      public_id: uniqueName,
      resource_type: "raw",
    });

    fs.unlinkSync(uploadPath);

    return result.secure_url;
  } catch (error) {
    console.log("Error while uploading the image :::", error);
    throw error;
  }
}

export default FileUploader;
