import { Product } from "../model/product";

const GetAllProduct = async (req, res) => {
  try {
    // lấy từ query, mặc định page=1, limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // tính skip
    const skip = (page - 1) * limit;

    // đếm tổng số sản phẩm
    const total = await Product.countDocuments();

    // lấy dữ liệu theo trang
    const data = await Product.find()
      .populate("caterori", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: sắp xếp mới nhất

    // nếu bạn muốn thêm field category_name:
    // const transformedData = data.map((product) => ({
    //   ...product.toObject(),
    //   category_name: product.caterori?.name || null,
    //   category_id: product.caterori?._id || null,
    // }));

    return res.status(200).json({
      data, // hoặc transformedData
      pagination: {
        total, // tổng số bản ghi
        page, // trang hiện tại
        limit, // số bản ghi / trang
        totalPages: Math.ceil(total / limit),
      },
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
      "name",
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
    const data = await Product.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      message: "Delete success",
      // data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
