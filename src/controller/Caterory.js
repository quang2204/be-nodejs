import { Caterory } from "../model/Caterory";
export const GetAllCaterory = async (req, res) => {
  try {
    const data = await Caterory.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};
export const CreateCaterory = async (req, res) => {
  try {
    const data = await Caterory(req.body).save();
    return res.status(200).json({
      message: "Them thanh cong ",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
