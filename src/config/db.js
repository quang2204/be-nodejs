import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/node");
  } catch (error) {
    console.error(error);
  }
};
