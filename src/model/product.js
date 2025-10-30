import mongoose from "mongoose";
const productSchma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    caterori: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "caterories",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    albumImg: {
      type: [String],
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
export const Product = mongoose.model("products", productSchma);
