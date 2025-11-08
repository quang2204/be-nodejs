import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  madh: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  
  address: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: Number,
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: [
      "Wait for confirmation",
      "Confirm",
      "Shipping",
      "Successful delivery",
      "Success",
      "Canceled",
    ],
    default: "Wait for confirmation",
  },
  payment: {
    type: String,
    enum: ["COD", "VNPAY", "MOMO"],
    default: "COD",
  },
  userId: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
});
export const Order = mongoose.model("Order", orderSchema);
