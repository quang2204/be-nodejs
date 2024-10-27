import { Cart } from "../model/cart";
export const AddCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { productid, quantity } = req.body;

    // Tìm sản phẩm trong giỏ hàng của người dùng
    let cartItem = await Cart.findOne({ user: userid, product: productid });
    if (!cartItem) {
      // Nếu sản phẩm chưa có trong giỏ hàng, tạo sản phẩm mới với số lượng
      cartItem = new Cart({
        user: userid,
        product: productid,
        quantity: quantity || 1, // Mặc định là 1 nếu không có quantity
      });
    } else {
      // Nếu sản phẩm đã có, tăng số lượng
      cartItem.quantity += quantity;
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    await cartItem.save();
    return res.status(200).json({ message: "Thêm thành công", data: cartItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCart = async (req, res) => {
  try {
    const { userid } = req.params;

    // Tìm tất cả sản phẩm trong giỏ hàng của người dùng
    const cart = await Cart.find({ user: userid }).populate({
      path: "product",
      select: "name price imageUrl",
    });

    return res.status(200).json({ data: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export  const DeleteCart = async (req, res) => {
  try {
  const { userid, productid } = req.params;
  await Cart.findOneAndDelete({ user: userid, product: productid });
  return res.status(200).json({ message: "Xóa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export const UpdateCart = async (req, res) => {
  try {
    const { userid, productid } = req.params;
    console.log(userid, productid)
    const { quantity } = req.body;
  const data= await Cart.findOneAndUpdate({ user: userid, product: productid }, { quantity },{
    new: true
  });
    return res.status(200).json({message: "Cap nhat thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}