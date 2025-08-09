import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreOrder } from '@/types/firestore';
import { DirectOrderItem } from '@/contexts/DirectOrderContext';

const COLLECTION_NAME = 'orders';

export interface OrderInput {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: DirectOrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

// Convert DirectOrderItem to order item
const convertDirectOrderItemToOrderItem = (item: DirectOrderItem) => ({
  productId: item.id,
  productName: item.name,
  price: item.price,
  quantity: item.quantity,
  size: item.size,
  color: item.color,
  image: item.image
});

// Convert Firestore document to Order
export const convertFirestoreToOrder = (doc: any): FirestoreOrder => {
  const data = doc.data();
  return {
    id: doc.id,
    customerId: data.customerId,
    customerInfo: data.customerInfo,
    items: data.items,
    totalAmount: data.totalAmount,
    status: data.status,
    paymentStatus: data.paymentStatus,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    orderDate: data.orderDate,
    deliveryDate: data.deliveryDate,
    trackingNumber: data.trackingNumber,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

// Create new order
export const createOrder = async (orderInput: OrderInput): Promise<string> => {
  try {
    console.log('Creating order with input:', orderInput);
    
    // Validate required fields
    if (!orderInput.customerInfo?.name) {
      throw new Error('Customer name is required');
    }
    if (!orderInput.customerInfo?.phone) {
      throw new Error('Customer phone is required');
    }
    if (!orderInput.items || orderInput.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    if (!orderInput.shippingAddress?.street) {
      throw new Error('Shipping address is required');
    }
    if (!orderInput.shippingAddress?.city) {
      throw new Error('Shipping city is required');
    }

    const orderData: any = {
      customerInfo: orderInput.customerInfo,
      items: orderInput.items.map(convertDirectOrderItemToOrderItem),
      totalAmount: orderInput.totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: orderInput.shippingAddress,
      orderDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Only add optional fields if they have values
    if (orderInput.billingAddress) {
      orderData.billingAddress = orderInput.billingAddress;
    }
    
    if (orderInput.notes && orderInput.notes.trim()) {
      orderData.notes = orderInput.notes;
    }

    console.log('Prepared order data for Firestore:', orderData);

    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderData);
    console.log('Order created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the original error with its message
    }
    throw new Error('Failed to create order');
  }
};

// Get all orders
export const getAllOrders = async (): Promise<FirestoreOrder[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToOrder);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<FirestoreOrder | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFirestoreToOrder(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string, 
  status: FirestoreOrder['status'],
  trackingNumber?: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      status,
      updatedAt: Timestamp.now()
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      updateData.deliveryDate = Timestamp.now();
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// Update payment status
export const updatePaymentStatus = async (
  id: string, 
  paymentStatus: FirestoreOrder['paymentStatus']
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }
};

// Get orders by status
export const getOrdersByStatus = async (status: FirestoreOrder['status']): Promise<FirestoreOrder[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToOrder);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw new Error('Failed to fetch orders by status');
  }
};

// Get orders by customer email
export const getOrdersByCustomerEmail = async (email: string): Promise<FirestoreOrder[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('customerInfo.email', '==', email),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToOrder);
  } catch (error) {
    console.error('Error fetching orders by customer email:', error);
    throw new Error('Failed to fetch orders by customer email');
  }
};

// Get recent orders
export const getRecentOrders = async (limitCount: number = 10): Promise<FirestoreOrder[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToOrder);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw new Error('Failed to fetch recent orders');
  }
};

// Real-time orders listener
export const subscribeToOrders = (callback: (orders: FirestoreOrder[]) => void): (() => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const orders = querySnapshot.docs.map(convertFirestoreToOrder);
    callback(orders);
  }, (error) => {
    console.error('Error in orders subscription:', error);
  });
};

// Delete order (admin only)
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
};

// Get order statistics
export const getOrderStatistics = async (): Promise<{
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const orders = querySnapshot.docs.map(convertFirestoreToOrder);

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      completedOrders: orders.filter(order => order.status === 'delivered').length,
      totalRevenue: orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };

    return stats;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw new Error('Failed to fetch order statistics');
  }
};