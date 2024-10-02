import jwt from "jsonwebtoken";

export const checkout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "200422", (err, data) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            message: "Token hết hạn",
          });
        } else if (err.name == "JsonWebTokenError") {
          return res.status(400).json({
            success: false,
            message: "Token khong hop le",
          });
        }
      }
      next()
      //   console.log(err);
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
