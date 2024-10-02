import mongoose from "mongoose";
const productSchma = new mongoose.Schema({
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
},
{
  versionKey: false,
  timestamps: true,
});
export const Product = mongoose.model("products", productSchma);
