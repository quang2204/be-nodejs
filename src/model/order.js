import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
      required: false,
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
        quantity: { type: Number, default: 1 },
      },
    ],

    orderDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Xác nhận", "Đang giao hàng", "Thành Công", "Hủy"],
      default: "Xác nhận",
    },

    payment: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO"],
      default: "COD",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vouchers",
      required: false,
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
