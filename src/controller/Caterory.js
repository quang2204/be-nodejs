import { Caterory } from "../model/Caterory";
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
    await Caterory.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Xóa thành công ",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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