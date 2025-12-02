import express from "express";

import {
  createComment,
  deleteComment,
  getCommentStatsForAdmin,
  getComments,
  getCommentsByProduct,
  getCommentsByProductId,
  updateComment,
} from "../controller/comment.js";

const router = express.Router();

// (C) Create - Tạo comment
// POST /api/comments
router.post("/comment", createComment);

// (R) Read - Lấy danh sách comment
// GET /api/comments
// Hỗ trợ query: ?productId=&userId=&status=&rating=
router.get("/comment", getComments);

// (R) Read - Lấy 1 comment theo id
// GET /api/comments/:id
router.get("/comment/:id", getCommentsByProductId);

// (U) Update - Cập nhật comment
// PUT /api/comments/:id
router.put("/comment/:id", updateComment);

// (D) Delete - Xoá comment
// DELETE /api/comments/:id
router.delete("/comment/:id", deleteComment);

// (R) Read - Lấy comment theo productId (thường dùng cho trang chi tiết sản phẩm)
// GET /api/comments/product/:productId
router.get("/comment/product/:productId", getCommentsByProduct);

router.get("/comment/admin/products", getCommentStatsForAdmin);

export default router;
