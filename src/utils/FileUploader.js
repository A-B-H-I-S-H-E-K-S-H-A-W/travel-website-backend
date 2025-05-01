async function FileUploader(image) {
  try {
    const uniqueName =
      Date.now() + Math.floor(Math.random() * 1000000) + "-" + image.name;
    const uploadPath = `./src/public/temp/${uniqueName}`;

    await image.mv(uploadPath);

    return uniqueName;
  } catch (error) {
    console.log("Error while uploading the image :::", error);
    throw error;
  }
}

export default FileUploader;
