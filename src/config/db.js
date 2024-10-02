import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://quanglt22:quang2204@cluster0.4czbvw0.mongodb.net/products").then();
  } catch (error) {
    console.log(error);
  }
};
