import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // Người dùng nào comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    // Comment cho sản phẩm nào
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },

    // Nội dung comment
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Số sao đánh giá (nếu có)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true, // tự tạo createdAt, updatedAt
  }
);

export const Comment = mongoose.model("Comment", commentSchema);
