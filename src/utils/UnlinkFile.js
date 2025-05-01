import fs from "fs";

const UnlinkFile = (file) => {
  if (file) {
    try {
      fs.unlinkSync("./src/public/images/" + file);
    } catch (error) {
      console.log(error);
    }
  }
};

export default UnlinkFile;
