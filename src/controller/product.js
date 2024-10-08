import { Product } from "../model/product";

const GetAllProduct = async (req, res) => {
  try {
    const data = await Product.find().populate("caterori", "name");
    // const transformedData = data.map((product) => ({
    //   ...product.toObject(),
    //   category_name: product.caterori.name,
    //   category_id: product.caterori._id,
    // }));
    return res.status(200).json(data);
    return res.status(200).json(transformedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const Pagination = async (req, res) => {
  try {
    const page = req.query.page || req.params.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;
    const data = await Product.find().skip(skip).limit(limit).where("_id");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const GetProductDetails = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    return res.status(201).json({
      message: "Get Product id : " + req.params.id,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
};
