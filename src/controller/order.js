import { Order } from "../model/order";

export const GetOrder = async (req, res) => {
  try {
    const data = await Order.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const AddOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    return res.status(200).json(order);
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
    const data = await Order.findById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
