import { Order } from "../model/order";
import { Voucher } from "../model/voucher";

export const CreateVoucher = async (req, res) => {
  try {
    const data = await Voucher(req.body).save();
    return res.status(200).json({
      message: "Them thanh cong",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
export const getAllVoucher = async (req, res) => {
  try {
    const data = await Voucher.find();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
export const UpdateVoucher = async (req, res) => {
  try {
    const data = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
export const DeleteVoucher = async (req, res) => {
  try {
    const voucherId = req.params.id;

    // Kiểm tra voucher đã được dùng trong order chưa
    const orderExist = await Order.findOne({
      voucherId: voucherId,
    });

    if (orderExist) {
      return res.status(400).json({
        message: "Voucher đã được sử dụng trong đơn hàng, không thể xóa",
      });
    }

    // Chưa có order nào dùng → cho xóa
    await Voucher.findByIdAndDelete(voucherId);

    return res.status(200).json({
      message: "Xóa voucher thành công",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
export const DetailVoucher = async (req, res) => {
  try {
    const data = await Voucher.findById(req.params.id);
    return res.status(500).json(data);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
