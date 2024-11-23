import mongoose from "mongoose";
const DanhMucSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    SubCategory: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
export const Caterory = mongoose.model("caterories", DanhMucSchema);
