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
        priceBeforeDis: { type: Number, required: true },
        priceAfterDis: { type: Number, required: true },
        name: { type: String, required: true },
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
      enum: ["COD", "VNPAY", "MOMO", "GG PAY", "ZALO PAY"],
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
  default: null,
  set: v => (v === "" ? null : v),
},


    note: {
      type: String,
    },

    isPaymentSucces: {
      type: Boolean,
      default: false,
    },
    cancelReason: {
      type: String, // lý do khách muốn hủy
    },
    isCancelApproved: {
      type: Boolean,
      default: false, // admin chưa duyệt yêu cầu hủy
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
