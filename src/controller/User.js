import { z } from "zod";
import { User } from "../Model/User";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const Register = async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);
    const emailUser = await User.findOne({ email: userData.email });
    const usernameUser = await User.findOne({ username: userData.username });

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
    const createdUser = await User.create(userData);
    return res.status(400).json({
      message: "User registered successfully!",
      user: createdUser,
    });
  } catch (error) {
    const messagesPath = error.issues?.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    if (messagesPath && messagesPath.length > 0) {
      const errorMessage = messagesPath.reduce((acc, message) => {
        acc[message.path] = { message: message.message };
        return acc;
      }, {});
      return res.status(400).json({
        message: errorMessage,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const GetUser = async (req, res) => {
  try {
    const data = await User.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(err.message);
  }
};
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = userSchema.parse(req.body);
    const user = await login.findOne({ email: email, password: password });
    if (!user) {
      return res.status(400).json("Không có tài khoản này");
    }
    return res.status(200).json(user);
  } catch (error) {
    const messagesPath = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    if (messagesPath && messagesPath.length > 0) {
      const error = messagesPath.reduce((err, message) => {
        err[message.path] = message.message;
        return err;
      }, {});
      return res.status(500).json(error);
    }
    return res.status(500).json(error);
  }
};
