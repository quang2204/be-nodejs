import { Order } from "../model/order";
import { Product } from "../model/product";

const GetAllProduct = async (req, res) => {
  try {


    // đếm tổng số sản phẩm
    const total = await Product.countDocuments();

    // lấy dữ liệu theo trang
    const data = await Product.find()
      .populate("caterori", "name")
      .sort({ createdAt: -1 }); // optional: sắp xếp mới nhất

    // nếu bạn muốn thêm field category_name:
    // const transformedData = data.map((product) => ({
    //   ...product.toObject(),
    //   category_name: product.caterori?.name || null,
    //   category_id: product.caterori?._id || null,
    // }));

    return res.status(200).json({
      data, // hoặc transformedData
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const Pagination = async (req, res) => {
  try {
    const page = req.query.page || req.params.page || 1;
    const totalProduct = await Product.countDocuments();
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;
    const data = await Product.find().skip(skip).limit(limit).where("_id");
    const toatalPages = Math.ceil(totalProduct / limit);
    return res.status(200).json({
      currentPage: page,
      toatalPages,
      totalProduct,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const GetProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "caterori",
      "name"
    );

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: `Product found with ID: ${req.params.id}`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const GetProductsCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ caterori: category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm nào trong danh mục này." });
    }

    res.status(200).json(products); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
const AddProduct = async (req, res) => {
  try {
    const data = await Product(req.body).save();
    return res.status(201).json({
      message: "Them thanh cong ",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const UpdateProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(201).json({
      message: "Update success",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Kiểm tra xem sản phẩm có xuất hiện trong đơn hàng nào không
    const ordersWithProduct = await Order.countDocuments({
      "products.productId": productId,
    });

    // Nếu sản phẩm có trong bất kỳ đơn hàng nào => không cho xoá
    if (ordersWithProduct > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa sản phẩm vì đang tồn tại trong ${ordersWithProduct} đơn hàng`,
      });
    }

    // Nếu không có trong đơn hàng nào => cho phép xoá
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  Pagination,
  GetProductDetails,
  GetAllProduct,
  AddProduct,
  UpdateProduct,
  DeleteProduct,
  GetProductsCategory,
};
