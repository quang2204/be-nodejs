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
    role: {
      type: String,
      enum: ["admin", "user", "manage"],
      default: "admin",
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = mongoose.model("Users", userSchma);
