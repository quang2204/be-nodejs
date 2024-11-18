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
    variant: [
      {
        color: { type: String },
        size: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        imageUrl: { type: String },
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
    // albumImg: {
    //   type: [
    //     {
    //       url: {
    //         type: String,
    //         required: true,
    //       },
    //       description: { type: String },
    //     },
    //   ],
    //   required: true,
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
export const Product = mongoose.model("products", productSchma);
