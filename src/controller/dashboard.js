import { User } from "../model/User";
import { Order } from "../model/order";
import { Product } from "../model/product";

const DashboardStats = async (req, res) => {
  try {
    // query: from=YYYY-MM-DD, to=YYYY-MM-DD, granularity=day|month, topLimit, recentLimit
    let from, to;
    const granularity = req.query.granularity === "month" ? "month" : "day";
    const dateFormat = granularity === "month" ? "%Y-%m" : "%Y-%m-%d";
    const topLimit = Math.min(parseInt(req.query.topLimit || "8", 10), 50);
    const recentLimit = Math.min(
      parseInt(req.query.recentLimit || "5", 10),
      50
    );

    if (req.query.from) {
      const [year, month, day] = req.query.from.split("-").map(Number);
      from = new Date(year, month - 1, day, 0, 0, 0, 0); // Start of local day
    } else {
      from = new Date(new Date().getFullYear(), 0, 1); // Jan 1 of current year, local 00:00
    }

    if (req.query.to) {
      const [year, month, day] = req.query.to.split("-").map(Number);
      to = new Date(year, month - 1, day, 23, 59, 59, 999); // End of local day
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
      ); // End of current local day
    }

    // match cho tất cả truy vấn trong khoảng thời gian
    const matchAll = { orderDate: { $gte: from, $lte: to } };
    const matchPaid = { ...matchAll, status: "Success" }; // chỉ tính doanh thu khi Success

    // 1) Totals: earnings (totalPrice), orders, unique customers (userId), total products
    const totalsAggPromise = Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$totalPrice" },
          customers: { $addToSet: "$userId" }, // nếu không có userId, có thể thay = "$phone"
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

    // 2) Chart: số đơn theo thời gian (Order Number)
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

    // 3) Chart: doanh thu theo thời gian (Total Order)
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

    // 4) Best selling products (theo qty, có lookup tên/ảnh/giá nếu Product có)
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
          productId: "$product._id",
          name: "$product.name",
          image: "$product.image",
          price: "$product.price",
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
      .populate("products.productId", "name image");

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

    const totals = totalsAgg[0] || {
      totalOrders: 0,
      totalEarnings: 0,
      totalCustomers: 0,
    };

    return res.status(200).json({
      totals: {
        totalEarnings: totals.totalEarnings,
        totalOrders: totals.totalOrders,
        totalCustomers: totals.totalCustomers,
        totalProduct,
      },
      charts: {
        orderNumber,
        revenueChart,
      },
      topProducts,
      recentOrders,
      filter: { from, to, granularity },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export default DashboardStats;
