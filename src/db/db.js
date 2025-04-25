import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongoDBConnection = async () => {
  try {
    const connect = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    return connect;
  } catch (error) {
    console.log("Database Connection Error: ", error);
    throw error;
  }
};

export { mongoDBConnection };
