import jwt from "jsonwebtoken";

// It's better to store secrets in environment variables
const ACCESS_TOKEN_SECRET =
  "76ca127f19145007f2723d48ce8cbf296fb7427ac4ffe557daa38952697dabb272c181f843bccfd89065158f44470be37eca0f6e6ba9da90a107f2dc0b90164a";

// Middleware to check token validity from cookies
export const checkout = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing in cookies",
      });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token expired",
          });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(400).json({
            success: false,
            message: "Invalid token",
          });
        }  else {
          return res.status(400).json({
            success: false,
            message: "Token verification failed",
          });
        }
      }
      if (decoded.role !=="admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied: Admins only",
        });
      }
      // Attach decoded user to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
