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
    variants: [
      {
        quantity: {
          type: Number,
          required: false,
        },
        size: {
          type: String,
          required: false,
        },
        color: {
          type: String,
          required: false,
        },
        imgUrl: {
          type: String,
          required: false,
        },
      },
    ],

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
