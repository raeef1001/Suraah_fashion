import { useState, useEffect } from 'react';
import { FirestoreOrder } from '@/types/firestore';
import { 
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getOrdersByCustomerEmail,
  getRecentOrders,
  getOrderStatistics,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  subscribeToOrders,
  OrderInput
} from '@/services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const fetchedOrder = await getOrderById(id);
        setOrder(fetchedOrder);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  return { order, loading, error };
};

export const useOrderMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (orderData: OrderInput) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Placing order with data:', orderData);
      const orderId = await createOrder(orderData);
      console.log('Order created successfully with ID:', orderId);
      return orderId;
    } catch (err) {
      console.error('Order creation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId: string, 
    status: FirestoreOrder['status'], 
    trackingNumber?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateOrderStatus(orderId, status, trackingNumber);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (
    orderId: string, 
    paymentStatus: FirestoreOrder['paymentStatus']
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updatePaymentStatus(orderId, paymentStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteOrder(orderId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    placeOrder,
    updateStatus,
    updatePayment,
    deleteOrder: removeOrder,
    loading,
    error
  };
};