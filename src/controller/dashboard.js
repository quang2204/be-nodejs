import { User } from "../model/User";
import { Order } from "../model/order";
import { Product } from "../model/product";

const DashboardStats = async (req, res) => {
  try {
    // query: from=YYYY-MM-DD, to=YYYY-MM-DD, granularity=day|month, topLimit, recentLimit, timezone (+07:00)
    const granularity = req.query.granularity === "month" ? "month" : "day";
    const dateFormat = granularity === "month" ? "%Y-%m" : "%Y-%m-%d";
    const topLimit = Math.min(parseInt(req.query.topLimit || "8", 10), 50);
    const recentLimit = Math.min(
      parseInt(req.query.recentLimit || "5", 10),
      50
    );
    const timezone = req.query.timezone || "+07:00";

    // enum trạng thái (theo yêu cầu)
    const STAT_CONFIRM = "Xác nhận";
    const STAT_SHIPPING = "Đang giao hàng";
    const STAT_SUCCESS_VN = "Thành Công";
    const STAT_SUCCESS_EN = "Success"; // nếu DB cũ dùng tiếng Anh
    const STAT_CANCEL = "Hủy";

    // parse 'from' & 'to' (support YYYY-MM and YYYY-MM-DD)
    let from, to;
    if (req.query.from) {
      const parts = req.query.from.split("-").map(Number);
      if (parts.length === 2) {
        const [y, m] = parts;
        from = new Date(y, m - 1, 1, 0, 0, 0, 0);
      } else {
        const [y, m, d] = parts;
        from = new Date(y, m - 1, d, 0, 0, 0, 0);
      }
    } else {
      const now = new Date();
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    }

    if (req.query.to) {
      const parts = req.query.to.split("-").map(Number);
      if (parts.length === 2) {
        const [y, m] = parts;
        to = new Date(y, m, 0, 23, 59, 59, 999); // end of month
      } else {
        const [y, m, d] = parts;
        to = new Date(y, m - 1, d, 23, 59, 59, 999);
      }
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

    const matchAll = { orderDate: { $gte: from, $lte: to } };
    // paid statuses: hỗ trợ cả tiếng VN lẫn "Success"
    const paidStatuses = [STAT_SUCCESS_VN, STAT_SUCCESS_EN];
    const matchPaid = { ...matchAll, status: { $in: paidStatuses } };

    // --- Promises ---
    // totals for all orders (count, unique customers, totalRevenueAll)
    const totalsAllPromise = Order.aggregate([
      { $match: matchAll },
      {
        $group: {
          _id: null,
          totalOrdersAll: { $sum: 1 },
          totalRevenueAll: { $sum: { $ifNull: ["$totalPrice", 0] } },
          customersAll: {
            $addToSet: {
              $cond: [
                { $ifNull: ["$userId", false] },
                { $toString: "$userId" },
                { $concat: [{ $ifNull: ["$phone", "unknown"] }, " (guest)"] },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrdersAll: 1,
          totalRevenueAll: 1,
          totalCustomersAll: { $size: "$customersAll" },
        },
      },
    ]);

    // totals for paid orders (earnings, paid orders, paid customers)
    const totalsPaidPromise = Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: null,
          totalOrdersPaid: { $sum: 1 },
          totalEarnings: { $sum: { $ifNull: ["$totalPrice", 0] } },
          customersPaid: {
            $addToSet: {
              $cond: [
                { $ifNull: ["$userId", false] },
                { $toString: "$userId" },
                { $concat: [{ $ifNull: ["$phone", "unknown"] }, " (guest)"] },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrdersPaid: 1,
          totalEarnings: 1,
          totalCustomersPaid: { $size: "$customersPaid" },
        },
      },
    ]);

    const totalProductPromise = Product.countDocuments();

    // 1) orderNumber theo thời gian, phân tách theo từng trạng thái (pivot)
    // Kết quả: [{ date: "2025-12-01", counts: { "Xác nhận": n, "Đang giao hàng": n, "Thành Công": n, "Hủy": n, total: n } }, ...]
    const orderNumberPromise = Order.aggregate([
      { $match: matchAll },
      {
        $project: {
          dateStr: {
            $dateToString: { format: dateFormat, date: "$orderDate", timezone },
          },
          status: 1,
        },
      },
      {
        $group: {
          _id: { date: "$dateStr" },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", STAT_CONFIRM] }, 1, 0] },
          },
          shipping: {
            $sum: { $cond: [{ $eq: ["$status", STAT_SHIPPING] }, 1, 0] },
          },
          success_vn: {
            $sum: { $cond: [{ $eq: ["$status", STAT_SUCCESS_VN] }, 1, 0] },
          },
          success_en: {
            $sum: { $cond: [{ $eq: ["$status", STAT_SUCCESS_EN] }, 1, 0] },
          },
          canceled: {
            $sum: { $cond: [{ $eq: ["$status", STAT_CANCEL] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          counts: {
            "Xác nhận": "$confirmed",
            "Đang giao hàng": "$shipping",
            // gộp 2 trường success nếu DB chứa cả hai dạng
            "Thành Công": { $add: ["$success_vn", "$success_en"] },
            Hủy: "$canceled",
            total: "$total",
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // 2) revenue chart (paid only) - như trước
    const revenueChartPromise = Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$orderDate", timezone },
          },
          revenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1 } },
    ]);

    // 3) top products (paid)
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
          productId: {
            $cond: [
              { $ifNull: ["$product._id", false] },
              "$product._id",
              "$_id",
            ],
          },
          name: { $ifNull: ["$product.name", "Unknown product"] },
          image: "$product.image",
          price: "$product.price",
          qty: 1,
        },
      },
    ]);

    // 4) recent orders
    const recentOrdersPromise = Order.find(matchAll)
      .sort({ orderDate: -1 })
      .limit(recentLimit)
      .select(
        "madh customerName phone totalPrice status payment orderDate products userId"
      )
      .populate("products.productId", "name image price");

    // await all promises
    const [
      totalsAllAgg,
      totalsPaidAgg,
      totalProduct,
      orderNumber,
      revenueChart,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      totalsAllPromise,
      totalsPaidPromise,
      totalProductPromise,
      orderNumberPromise,
      revenueChartPromise,
      topProductsPromise,
      recentOrdersPromise,
    ]);

    const aggAll = (totalsAllAgg && totalsAllAgg[0]) || {
      totalOrdersAll: 0,
      totalRevenueAll: 0,
      totalCustomersAll: 0,
    };
    const aggPaid = (totalsPaidAgg && totalsPaidAgg[0]) || {
      totalOrdersPaid: 0,
      totalEarnings: 0,
      totalCustomersPaid: 0,
    };

    return res.status(200).json({
      totals: {
        // tổng tất cả đơn
        totalOrdersAll: aggAll.totalOrdersAll || 0,
        totalCustomersAll: aggAll.totalCustomersAll || 0,
        totalRevenueAll: aggAll.totalRevenueAll || 0, // <-- tổng doanh thu (tất cả trạng thái)
        // paid-specific
        totalOrdersPaid: aggPaid.totalOrdersPaid || 0,
        totalEarnings: aggPaid.totalEarnings || 0, // <-- doanh thu từ đơn Thành Công / Success
        totalCustomersPaid: aggPaid.totalCustomersPaid || 0,
        // products
        totalProduct: totalProduct || 0,
      },
      charts: {
        orderNumber, // mảng theo ngày với counts per status
        revenueChart, // doanh thu theo thời gian (chỉ Success/Thành Công)
      },
      topProducts,
      recentOrders,
      filter: {
        from: from.toISOString(),
        to: to.toISOString(),
        granularity,
        timezone,
      },
    });
  } catch (err) {
    console.error("DashboardStats error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

export default DashboardStats;
