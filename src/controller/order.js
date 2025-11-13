import { Order } from "../model/order";
import { Product } from "../model/product";

export const GetOrder = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      payment = "",
    } = req.query;

    // Tạo query filter
    const filter = {};

    // Tìm kiếm theo mã đơn hàng
    if (search) {
      filter.orderCode = { $regex: search, $options: "i" };
    }

    // Lọc theo trạng thái
    if (status) {
      filter.status = status;
    }

    // Lọc theo phương thức thanh toán
    if (payment) {
      filter.paymentMethod = payment;
    }

    // Tính toán phân trang
    const skip = (Number(page) - 1) * Number(limit);

    // Lấy dữ liệu với filter và phân trang
    const data = await Order.find(filter)
      .populate("products.productId", "name price imageUrl")
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .skip(skip)
      .limit(Number(limit));

    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments(filter);

    return res.status(200).json({
      data,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetOrderByUser = async (req, res) => {
  try {
    const data = await Order.find({ userId: req.params.userid })
      .populate("products.productId", "name price imageUrl");
    console.log(req.params.userid);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AddOrder = async (req, res) => {
  try {
    const { products } = req.body;

    // Lấy thông tin giá từng sản phẩm
    const productIds = products.map((p) => p.productId);
    const productData = await Product.find({ _id: { $in: productIds } });

    // Tính tổng tiền
    let totalPrice = 0;
    products.forEach((item) => {
      const prod = productData.find((p) => p._id.toString() === item.productId);
      if (prod) {
        totalPrice += prod.price * item.quantity;
      }
    });

    // Tạo object order có totalPrice
    const orderData = {
      ...req.body,
      totalPrice: totalPrice,
    };

    const order = new Order(orderData);
    await order.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    const { id } = req.params;
    const data = await Order.findByIdAndDelete(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Order.findById(id)
      .populate("products.productId", "name price imageUrl");
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
