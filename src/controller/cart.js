import { Cart } from "../model/cart";
import { Order } from "../model/order";
export const AddCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { productid, quantity, color, size } = req.body;
    // Tìm sản phẩm trong giỏ hàng của người dùng
    let cartItem = await Cart.findOne({ user: userid, product: productid });

    if (!cartItem) {
      // Nếu sản phẩm chưa có trong giỏ hàng, tạo sản phẩm mới với số lượng
      cartItem = new Cart({
        user: userid,
        product: productid,
        quantity: quantity || 1, // Mặc định là 1 nếu không có quantity
        color,
        size,
      });
    }
    // else if (cartItem.color !== color || cartItem.size !== size) {
    //   cartItem = new Cart({
    //     user: userid,
    //     product: productid,
    //     quantity: quantity || 1, // Mặc định là 1 nếu không có quantity
    //     color,
    //     size,
    //   });
    // }
    else {
      // Nếu sản phẩm đã có, tăng số lượng
      cartItem.quantity += quantity;
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    await cartItem.save();
    console.log(cartItem);
    return res.status(201).json({ message: "Thêm thành công", data: cartItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const cart = await Cart.find({ user: userid }).populate({
      path: "product",
      select: "name price imageUrl",
    });
    const total = cart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
    return res.status(200).json({ data: cart, totalPrice: total });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findOneAndDelete(id);
    return res.status(200).json({ message: "Xóa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteAllCart = async (req, res) => {
  try {
    const { userid } = req.params;
    await Cart.deleteMany({ user: userid });
    return res.status(200).json({ message: "Xóa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// export const DeleteAllOrder = async (req, res) => {
//   try {
//     const { userid } = req.params;
//     await Order.deleteMany();
//     return res.status(200).json({ message: "Xóa thanh cong" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const UpdateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findByIdAndUpdate(id, { quantity }, { new: true });
    return res.status(200).json({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
