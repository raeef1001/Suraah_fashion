import { useState, useEffect } from 'react';
import { 
  getDashboardStats, 
  getRecentOrdersForDashboard, 
  getTopProductsForDashboard 
} from '@/services/dashboardService';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalCategories: number;
    totalRevenue: number;
    monthlyGrowth: {
      products: number;
      orders: number;
      customers: number;
      revenue: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch };
};

export const useRecentOrders = () => {
  const [orders, setOrders] = useState<Array<{
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: string;
    time: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const recentOrders = await getRecentOrdersForDashboard(5);
        setOrders(recentOrders);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export const useTopProducts = () => {
  const [products, setProducts] = useState<Array<{
    name: string;
    sales: number;
    revenue: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const topProducts = await getTopProductsForDashboard(4);
        setProducts(topProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch top products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};