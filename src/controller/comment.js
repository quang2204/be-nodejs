import { Comment } from "../model/comment";
import { Product } from "../model/product";

// Tạo comment mới
export const createComment = async (req, res) => {
  try {
    const { userId, productId, content, rating, displayName } = req.body;

    if (!userId || !productId || !content) {
      return res.status(400).json({
        message: "userId, productId và content là bắt buộc",
      });
    }

    // Nếu productId là 1 array → tạo nhiều comment
    if (Array.isArray(productId)) {
      const commentsToCreate = productId.map((id) => ({
        userId,
        productId: id,
        content,
        rating,
        displayName,
      }));

      const savedComments = await Comment.insertMany(commentsToCreate);

      return res.status(201).json({
        message: "Đã tạo nhiều comment",
        comments: savedComments,
      });
    }

    // Nếu productId chỉ là 1 id → tạo 1 comment
    const comment = new Comment({
      userId,
      productId,
      content,
      rating,
      displayName,
    });

    const savedComment = await comment.save();

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error createComment:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy tất cả comment (có thể filter theo productId, userId,rating)
export const getComments = async (req, res) => {
  try {
    const { productId, userId, status, rating } = req.query;

    const filter = {};

    if (productId) filter.productId = productId;
    if (userId) filter.userId = userId;
    if (status) filter.status = status;

    // Nếu gửi rating thì lọc đúng rating đó
    if (rating) filter.rating = Number(rating);

    const comments = await Comment.find(filter)
      .populate("userId", "name email")
      .populate("productId", "name price")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error getComments:", error);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getCommentStatsForAdmin = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm
    const products = await Product.find();

    // Lấy toàn bộ comment 1 lần (nhanh hơn query từng sản phẩm)
    const comments = await Comment.find();

    // Tạo danh sách thống kê
    const result = products.map((product) => {
      const productComments = comments.filter(
        (c) => c.productId.toString() === product._id.toString()
      );

      // tổng số comment
      const count = productComments.length;

      // Tính điểm trung bình (rating)
      let avgRating = 0;
      if (count > 0) {
        const totalRating = productComments.reduce(
          (sum, c) => sum + (c.rating || 0),
          0
        );
        avgRating = totalRating / count;
      }

      return {
        productId: product._id,
        productName: product.name,
        productImage: product.imageUrl,
        description: product.description,
        count: count,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getCommentStatsForAdmin:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy chi tiết 1 comment theo id
export const getCommentsByProductId = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ productId: id })
      .populate("userId")
      .populate("productId", "name imageUrl description");

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có comment nào cho sản phẩm này" });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error getCommentsByProductId:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating, status, displayName } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content, rating, status, displayName },
      { new: true } // trả về doc sau khi update
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Không tìm thấy comment" });
    }

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updateComment:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Xoá comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Không tìm thấy comment" });
    }

    return res.status(200).json({ message: "Xoá comment thành công" });
  } catch (error) {
    console.error("Error deleteComment:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// (Optional) Lấy comment theo productId (API riêng)
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId, status: "approved" })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error getCommentsByProduct:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
