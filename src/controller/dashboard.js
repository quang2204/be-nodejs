import { User } from "../model/User";
import { Order } from "../model/order";
import { Product } from "../model/product";

const DashboardStats = async (req, res) => {
  try {
    // Parse and validate query parameters
    const granularity = req.query.granularity === "month" ? "month" : "day";
    const dateFormat = granularity === "month" ? "%Y-%m" : "%Y-%m-%d";
    const topLimit = Math.min(
      Math.max(parseInt(req.query.topLimit, 10) || 8, 1),
      50
    );
    const recentLimit = Math.min(
      Math.max(parseInt(req.query.recentLimit, 10) || 5, 1),
      50
    );

    // Parse date range with validation
    let from, to;

    if (req.query.from) {
      const [year, month, day] = req.query.from.split("-").map(Number);
      if (!year || !month || !day) {
        return res
          .status(400)
          .json({ message: "Invalid 'from' date format. Use YYYY-MM-DD" });
      }
      from = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      from = new Date(new Date().getFullYear(), 0, 1);
    }

    if (req.query.to) {
      const [year, month, day] = req.query.to.split("-").map(Number);
      if (!year || !month || !day) {
        return res
          .status(400)
          .json({ message: "Invalid 'to' date format. Use YYYY-MM-DD" });
      }
      to = new Date(year, month - 1, day, 23, 59, 59, 999);
    } else {
      const now = new Date();
      to = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
    }

    // Validate date range
    if (from > to) {
      return res
        .status(400)
        .json({ message: "'from' date cannot be after 'to' date" });
    }

    // Match conditions
    const matchAll = { orderDate: { $gte: from, $lte: to } };
    const matchPaid = { ...matchAll, status: "Success" };

    // 1) Totals aggregation
    const totalsAggPromise = Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$totalPrice" },
          customers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalEarnings: 1,
          totalCustomers: { $size: "$customers" },
        },
      },
    ]);

    const totalProductPromise = Product.countDocuments();

    // 2) Order count by time period
    const orderNumberPromise = Order.aggregate([
      { $match: matchAll },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$orderDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    // 3) Revenue by time period
    const revenueChartPromise = Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$orderDate" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1 } },
    ]);

    // 4) Top selling products
    const topProductsPromise = Order.aggregate([
      { $match: matchPaid },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          qty: { $sum: "$products.quantity" },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: topLimit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: { $ifNull: ["$product.name", "Unknown Product"] },
          image: { $ifNull: ["$product.imageUrl", null] },
          price: { $ifNull: ["$product.price", 0] },
          qty: 1,
        },
      },
    ]);

    // 5) Recent orders
    const recentOrdersPromise = Order.find(matchAll)
      .sort({ orderDate: -1 })
      .limit(recentLimit)
      .select(
        "madh customerName phone totalPrice status payment orderDate products"
      )
      .populate("products.productId", "name imageUrl")
      .lean();

    // Execute all queries in parallel
    const [
      totalsAgg,
      totalProduct,
      orderNumber,
      revenueChart,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      totalsAggPromise,
      totalProductPromise,
      orderNumberPromise,
      revenueChartPromise,
      topProductsPromise,
      recentOrdersPromise,
    ]);

    // Extract totals with default values
    const totals = totalsAgg[0] || {
      totalOrders: 0,
      totalEarnings: 0,
      totalCustomers: 0,
    };

    // Return formatted response
    return res.status(200).json({
      success: true,
      data: {
        totals: {
          totalEarnings: totals.totalEarnings || 0,
          totalOrders: totals.totalOrders || 0,
          totalCustomers: totals.totalCustomers || 0,
          totalProduct: totalProduct || 0,
        },
        charts: {
          orderNumber: orderNumber || [],
          revenueChart: revenueChart || [],
        },
        topProducts: topProducts || [],
        recentOrders: recentOrders || [],
      },
      filter: {
        from: from.toISOString(),
        to: to.toISOString(),
        granularity,
        topLimit,
        recentLimit,
      },
    });
  } catch (err) {
    console.error("DashboardStats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export default DashboardStats;
