import jwt from "jsonwebtoken";

// Middleware to check token validity
export const checkout = async (req, res, next) => {
  try {
    // Ensure authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || "200422", (err, data) => {
      if (err) {
        // Token errors
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
        } else {
          return res.status(400).json({
            success: false,
            message: "Token verification failed",
          });
        }
      }

      // If no error, proceed to the next middleware
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
