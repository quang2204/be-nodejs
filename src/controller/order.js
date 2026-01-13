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

    if (!products || products.length === 0) {
      throw new Error("Danh sách sản phẩm không hợp lệ");
    }

    req.body.totalPrice = products.reduce(
      (sum, item) => sum + item.priceAfterDis * item.quantity,
      0
    );

    for (const item of products) {
      // 1️⃣ Lấy product
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error("Không tìm thấy sản phẩm");

      // 2️⃣ Tìm đúng variant
      const variant = product.variants.find(
        (v) => v.color === item.color && v.status === true
      );

      if (!variant) {
        throw new Error(`Không tìm thấy biến thể ${item.name} - ${item.color}`);
      }

      // 3️⃣ Check tồn kho (CHUẨN)
      if (variant.quantity < item.quantity) {
        throw new Error(
          `Sản phẩm ${item.name} - màu ${item.color} không đủ số lượng`
        );
      }

      // 4️⃣ Trừ kho
      await Product.updateOne(
        {
          _id: item.productId,
          "variants._id": variant._id,
        },
        {
          $inc: {
            "variants.$.quantity": -item.quantity,
          },
        },
        { session }
      );

      // 5️⃣ Update quantity tổng
      const totalQuantity = product.variants.reduce(
        (sum, v) =>
          sum +
          (v._id.equals(variant._id) ? v.quantity - item.quantity : v.quantity),
        0
      );

      await Product.updateOne(
        { _id: item.productId },
        { quantity: totalQuantity },
        { session }
      );
    }

    const [order] = await Order.create([req.body], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: error.message });
  }
};


export const UpdateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const newStatus = req.body.status;

    // 1️⃣ Lấy order cũ
    const oldOrder = await Order.findById(id).session(session);

    if (!oldOrder) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // 2️⃣ Nếu chuyển sang HỦY → hoàn kho
    if (newStatus === "Hủy" && oldOrder.status !== "Hủy") {
      for (const item of oldOrder.products) {
        // 2.1️⃣ Hoàn lại quantity cho đúng variant
        await Product.updateOne(
          { _id: item.productId },
          {
            $inc: {
              "variants.$[v].quantity": item.quantity,
            },
          },
          {
            arrayFilters: [
              {
                "v.color": item.color,
                "v.status": true,
              },
            ],
            session,
          }
        );

        // 2.2️⃣ Lấy lại product để tính quantity tổng
        const product = await Product.findById(item.productId).session(session);

        if (!product) continue;

        const totalQuantity = product.variants.reduce(
          (sum, v) => sum + v.quantity,
          0
        );

        // 2.3️⃣ Update quantity tổng
        await Product.updateOne(
          { _id: item.productId },
          { quantity: totalQuantity },
          { session }
        );
      }
    }

    // 3️⃣ Update order
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
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
