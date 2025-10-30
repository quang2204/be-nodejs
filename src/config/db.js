import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://quang20042204_db_user:cztsyH3wuOSv5TlZ@cluster0.aidua81.mongodb.net/?appName=Cluster0"
      )
      .then();
  } catch (error) {
    console.log(error);
  }
};
