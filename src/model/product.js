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
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        imgUrl: {
          type: String,
          required: true,
        },
      },
    ],
    sizes: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
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
