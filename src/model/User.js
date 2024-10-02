import mongoose from "mongoose";
const userSchma = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = mongoose.model("Users", userSchma);
