import { Caterory } from "../model/Caterory";
import { Product } from "../model/product";
export const GetAllCategory = async (req, res) => {
  try {
    const data = await Caterory.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};
export const CreateCategory = async (req, res) => {
  try {
    const data = await Caterory(req.body).save();
    return res.status(201).json({
      message: "Them thanh cong ",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Kiểm tra danh mục có đang được dùng trong sản phẩm không
    const productExist = await Product.findOne({
      caterori: categoryId,
    });

    if (productExist) {
      return res.status(400).json({
        message: "Danh mục đang được sử dụng trong sản phẩm, không thể xóa",
      });
    }

    // Không có sản phẩm dùng danh mục → cho xóa
    await Caterory.findByIdAndDelete(categoryId);

    return res.status(200).json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const UpdateCategory = async (req, res) => {
  try {
    const data = await Caterory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Sửa thành công ",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailCategory = async (req, res) => {
  try {
    const data = await Caterory.findById(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};