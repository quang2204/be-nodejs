import mongoose from "mongoose";
import { Order } from "../model/order";
import { Product } from "../model/product";

export const GetOrder = async (req, res) => {
  try {
    const { search = "", status = "", payment = "" } = req.query;

    // Tạo query filter
    const filter = {};

    // Tìm kiếm theo mã đơn hàng / tên khách
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { orderCode: regex }, // mã đơn
        { customerName: regex }, // tên người mua
        // Có thể bổ sung thêm các field khác nếu schema có
        // { phone: regex },
        // { email: regex },
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      filter.status = status;
    }

    // Lọc theo phương thức thanh toán
    if (payment) {
      // nếu trong schema là paymentMethod thì sửa lại cho đúng
      // filter.paymentMethod = payment;
      filter.payment = payment;
    }

    // Lấy dữ liệu với filter và phân trang
    const [data] = await Promise.all([
      Order.find(filter)
        .populate("products.productId", "imageUrl")
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("GetOrder error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const GetOrderByUser = async (req, res) => {
  try {
    const data = await Order.find({ userId: req.params.userid }).populate(
      "products.productId",
      " imageUrl"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AddOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.body.voucherId === "") {
      req.body.voucherId = null;
    }

    const { products } = req.body;

    // Tính totalPrice server-side
    req.body.totalPrice = products.reduce((sum, item) => {
      return sum + item.priceAfterDis * item.quantity;
    }, 0);

    for (const item of products) {
      const result = await Product.updateOne(
        {
          _id: item.productId,
          "variants.color": item.color,
          "variants.quantity": { $gte: item.quantity },
          "variants.status": true,
          quantity: { $gte: item.quantity },
        },
        {
          $inc: {
            "variants.$.quantity": -item.quantity,
            quantity: -item.quantity,
          },
        },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw new Error(
          `Sản phẩm ${item.name} - màu ${item.color} không đủ số lượng`
        );
      }
    }

    const order = await Order.create([req.body], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      message: error.message,
    });
  }
};



export const UpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteOrder = async (req, res) => {
  try {
    const data = await Order.deleteMany({});
    return res.status(200).json({
      message: "Đã xóa tất cả đơn hàng",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Order.findById(id)
      .populate("products.productId", " imageUrl")
      .populate("handledBy", "username")
      .populate("voucherId", "code discount type");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetOrderByStatus = async (req, res) => {
  try {
    const data = await Order.find({ status: req.params.status })
      .find({ userId: req.params.userid })
      .populate("voucher", "discount")
      .populate("products.productId", "name price imageUrl");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
