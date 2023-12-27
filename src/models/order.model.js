import mongoose from 'mongoose';
import toJSON from './plugins';
import {
  Shop,
  ShopStat,
  User,
  ProductStat,
  Category,
  OverallStat
} from '../models';
import moment from 'moment/moment';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const orderSchema = mongoose.Schema(
  {
    products: Array,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'An order must have a user']
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    shippingAddress: {
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentIntent: {
      type: String
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    phone: {
      type: String,
      required: [true, 'Phone Is Required']
    },
    status: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ]
    },
    dateOfPurchase: Date,
    yearOfPurchase: Number
  },
  { timestamps: true }
);

orderSchema.plugin(toJSON);

orderSchema.statics.calcShopStats = async function (shopId, currYear) {
  const dailyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.shop': shopId } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$dateOfPurchase' }
        },
        totalProductsQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let editedDailyStats;

  if (dailyStats && dailyStats.length !== 0) {
    editedDailyStats = dailyStats.map((stat) => {
      return {
        date: stat._id,
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductsQuantity
      };
    });
  }

  const monthlyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.shop': shopId } },
    {
      $group: {
        _id: {
          $month: '$dateOfPurchase'
        },
        totalProductsQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let editedMonthlyStats;

  if (monthlyStats && monthlyStats.length !== 0) {
    editedMonthlyStats = monthlyStats.map((stat) => {
      return {
        month: MONTHS[stat._id - 1],
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductsQuantity
      };
    });
  }

  const yearlyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.shop': shopId } },
    {
      $group: {
        _id: '$yearOfPurchase',
        yearlyTotalSoldUnits: { $sum: '$products.totalProductQuantity' },
        yearlySalesTotal: { $sum: '$products.totalProductPrice' }
      }
    }
  ]);

  const totalStats = await this.aggregate([
    { $unwind: '$products' },
    { $match: { 'products.shop': shopId } },
    {
      $group: {
        _id: null,
        totalSoldUnits: { $sum: '$products.totalProductQuantity' },
        salesTotal: { $sum: '$products.totalProductPrice' }
      }
    }
  ]);

  if (
    editedDailyStats &&
    editedDailyStats.length !== 0 &&
    editedMonthlyStats &&
    editedMonthlyStats.length !== 0 &&
    yearlyStats &&
    yearlyStats.length !== 0 &&
    totalStats &&
    totalStats.length !== 0
  ) {
    const shopStat = await ShopStat.findOneAndUpdate(
      { $and: [{ year: currYear, shop: shopId }] },
      {
        $set: {
          yearlySalesTotal: yearlyStats[0].yearlySalesTotal,
          yearlyTotalSoldUnits: yearlyStats[0].yearlyTotalSoldUnits,
          monthlyData: editedMonthlyStats,
          dailyData: editedDailyStats
        }
      },
      { upsert: true, new: true }
    );

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      {
        $set: {
          totalUnitsSold: totalStats[0].totalSoldUnits,
          totalSales: totalStats[0].salesTotal
        }
      },
      { new: true }
    );
  } else {
    console.log('calcShopStats error');
  }
};

orderSchema.statics.calcProductStats = async function (productId, currYear) {
  const dailyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.product': productId } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$dateOfPurchase' }
        },
        totalProductsQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let editedDailyStats;

  if (dailyStats && dailyStats.length !== 0) {
    editedDailyStats = dailyStats.map((stat) => {
      return {
        date: stat._id,
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductsQuantity
      };
    });
  }

  const monthlyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.product': productId } },
    {
      $group: {
        _id: {
          $month: '$dateOfPurchase'
        },
        totalProductsQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let editedMonthlyStats;

  if (monthlyStats && monthlyStats.length !== 0) {
    editedMonthlyStats = monthlyStats.map((stat) => {
      return {
        month: MONTHS[stat._id - 1],
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductsQuantity
      };
    });
  }

  const yearlyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    { $match: { 'products.product': productId } },
    {
      $group: {
        _id: '$yearOfPurchase',
        totalProductsQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    }
  ]);

  if (
    editedDailyStats &&
    editedDailyStats.length !== 0 &&
    editedMonthlyStats &&
    editedMonthlyStats.length !== 0 &&
    yearlyStats &&
    yearlyStats.length !== 0
  ) {
    const productStat = await ProductStat.findOneAndUpdate(
      { $and: [{ year: currYear, product: productId }] },
      {
        $set: {
          yearlySalesTotal: yearlyStats[0].totalSales,
          yearlyTotalSoldUnits: yearlyStats[0].totalProductsQuantity,
          monthlyData: editedMonthlyStats,
          dailyData: editedDailyStats
        }
      },
      { upsert: true, new: true }
    );
  } else {
    console.log('calcProductStats error');
  }
};

orderSchema.statics.calcOverallStats = async function (currYear) {
  const totalSalesAndQuantityStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$products.totalProductPrice' },
        totalProductQuantity: { $sum: '$products.totalProductQuantity' }
      }
    }
  ]);

  const totalUserStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    {
      $group: {
        _id: { $month: '$dateOfPurchase' },
        totalSales: { $sum: '$products.totalProductPrice' },
        totalProductQuantity: { $sum: '$products.totalProductQuantity' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let formattedMonthlyStats;

  if (monthlyStats && monthlyStats.length !== 0) {
    formattedMonthlyStats = monthlyStats.map((stat) => {
      return {
        month: MONTHS[stat._id - 1],
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductQuantity
      };
    });
  }

  const dailyStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    { $unwind: '$products' },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$dateOfPurchase' }
        },
        totalProductQuantity: { $sum: '$products.totalProductQuantity' },
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let formattedDailyStats;

  if (dailyStats && dailyStats.length !== 0) {
    formattedDailyStats = dailyStats.map((stat) => {
      return {
        date: stat._id,
        totalSales: stat.totalSales,
        totalUnits: stat.totalProductQuantity
      };
    });
  }

  const salesByCategoryStats = await this.aggregate([
    { $match: { yearOfPurchase: currYear } },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: '$products.category',
        totalSales: { $sum: '$products.totalProductPrice' }
      }
    }
  ]);

  let formattedSalesByCategoryStats;

  if (salesByCategoryStats && salesByCategoryStats.length !== 0) {
    formattedSalesByCategoryStats = await salesByCategoryStats.reduce(
      async (acc, { _id, totalSales }) => {
        const category = await Category.findById(_id);
        const { name } = category;
        acc[name] = totalSales;
        return acc;
      },
      {}
    );
  }

  if (totalUserStats && totalSalesAndQuantityStats) {
    const overallStat = await OverallStat.findOneAndUpdate(
      { year: currYear },
      {
        $set: {
          yearlySalesTotal: totalSalesAndQuantityStats[0].totalSales,
          yearlyTotalSoldUnits:
            totalSalesAndQuantityStats[0].totalProductQuantity,
          totalCustomers: totalUserStats[0].totalUsers,
          monthlyData: formattedMonthlyStats,
          dailyData: formattedDailyStats,
          salesByCategory: formattedSalesByCategoryStats
        }
      },
      { upsert: true, new: true }
    );
  } else {
    console.log('calcOverallStats error');
  }
};

orderSchema.statics.getMostPopularProducts = async function (shopId) {
  const stats = await this.aggregate([
    { $unwind: '$products' },
    {
      $group: {
        _id: { product: '$products.product', shop: '$products.shop' },
        quantitySold: { $sum: '$products.totalProductQuantity' }
      }
    },
    { $match: { '_id.shop': shopId } },
    { $sort: { quantitySold: 1 } },
    { $limit: 5 }
  ]);

  if (stats && stats.length !== 0) {
    const editedStats = stats.map((stat) => {
      return {
        product: stat._id.product,
        quantitySold: stat.quantitySold
      };
    });

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      {
        $set: {
          mostPopularProducts: editedStats
        }
      },
      { new: true }
    );
  } else {
    console.log('most popular products error');
  }
};

orderSchema.statics.getUserPreferredCategories = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: userId } },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.category',
        quantityBought: { $sum: '$products.totalProductQuantity' }
      }
    },
    { $sort: { quantityBought: -1 } },
    { $limit: 3 }
  ]);

  if (stats && stats.length !== 0) {
    const editedStats = stats.map((stat) => stat._id);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          preferredCategories: editedStats
        }
      },
      { new: true }
    );
  } else {
    console.log('preferred categories error');
  }
};

orderSchema.pre('save', async function (next) {
  this.dateOfPurchase = new Date(moment());
  this.yearOfPurchase = this.dateOfPurchase.getFullYear();

  this.products.forEach(async (product) => {
    await this.constructor.calcShopStats(product.shop, this.yearOfPurchase);

    await this.constructor.calcProductStats(
      product.product,
      this.yearOfPurchase
    );

    await this.constructor.calcOverallStats(this.yearOfPurchase);
  });

  next();
});

orderSchema.post('save', async function (doc) {
  await this.constructor.getUserPreferredCategories(this.user);
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
