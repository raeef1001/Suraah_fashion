import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreProduct } from '@/types/firestore';
import { FirestoreOrder } from '@/types/firestore';
import { FirestoreCategory } from '@/types/firestore';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Get products count
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const totalProducts = productsSnapshot.size;

    // Get orders count and calculate revenue
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreOrder[];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get categories count
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const totalCategories = categoriesSnapshot.size;

    // Calculate unique customers from orders
    const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email)).size;

    // Calculate monthly growth (simplified - comparing last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentOrders = orders.filter(order => 
      order.orderDate.toDate() >= thirtyDaysAgo
    );
    const previousOrders = orders.filter(order => 
      order.orderDate.toDate() >= sixtyDaysAgo && 
      order.orderDate.toDate() < thirtyDaysAgo
    );

    const recentRevenue = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const revenueGrowth = previousRevenue > 0 
      ? Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100)
      : 0;

    const ordersGrowth = previousOrders.length > 0
      ? Math.round(((recentOrders.length - previousOrders.length) / previousOrders.length) * 100)
      : 0;

    return {
      totalProducts,
      totalOrders,
      totalCustomers: uniqueCustomers,
      totalCategories,
      totalRevenue,
      monthlyGrowth: {
        products: 0, // We don't track product creation dates in this simple version
        orders: ordersGrowth,
        customers: 0, // We don't track customer registration dates
        revenue: revenueGrowth
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};

// Get recent orders for dashboard
export const getRecentOrdersForDashboard = async (limitCount: number = 5) => {
  try {
    const q = query(
      collection(db, 'orders'), 
      orderBy('orderDate', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreOrder;
      const orderDate = data.orderDate.toDate();
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
      
      let timeAgo;
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        id: `#${doc.id.slice(-4).toUpperCase()}`,
        customer: data.customerInfo.name,
        product: data.items[0]?.productName || 'Multiple Items',
        amount: data.totalAmount,
        status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
        time: timeAgo
      };
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw new Error('Failed to fetch recent orders');
  }
};

// Get top selling products for dashboard
export const getTopProductsForDashboard = async (limitCount: number = 4) => {
  try {
    // Get all orders to calculate product sales
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const orders = ordersSnapshot.docs.map(doc => doc.data()) as FirestoreOrder[];

    // Calculate sales by product
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            sales: 0,
            revenue: 0
          };
        }
        productSales[item.productId].sales += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    // Sort by sales and get top products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limitCount);

    return topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw new Error('Failed to fetch top products');
  }
};