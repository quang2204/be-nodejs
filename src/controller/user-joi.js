import { User } from "../model/User";
import hash from "bcryptjs";
import { reqSchma, loginSchma } from "../Schma/auth";
import jwt from "jsonwebtoken";
export const singup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const { error } = reqSchma.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const list = error.details.map((issue) => ({
        message: issue.message,
      }));
      return res.status(400).json(list);
    }
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    if (emailUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    if (usernameUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    const hashedPassword = await hash.hash(password, 10);
    await User.create({ username, email, password: hashedPassword, role });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Đăng Ký thất bại",
      error: error.message,
    });
  }
};
export const singin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchma.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const list = error.details.map((issue) => ({
        message: issue.message,
      }));
      return res.status(400).json(list);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Không có tài khoản này" });
    }
    const isMatch = await hash.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }
    const token = jwt.sign({ id: user._id }, "200422", {
      expiresIn: "30s",
    });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      token,
      user,
      message: "Đăng Nhập Thành Công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const GetUser = async (req, res) => {
  try {
    const data = await User.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const checkname = await User.findOne({ username });
    if (checkname) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Update success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      message: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
