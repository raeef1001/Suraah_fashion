import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DirectOrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  category: string;
}

interface DirectOrderContextType {
  orderItem: DirectOrderItem | null;
  setOrderItem: (item: DirectOrderItem) => void;
  clearOrder: () => void;
  updateQuantity: (quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const DirectOrderContext = createContext<DirectOrderContextType | undefined>(undefined);

export const useDirectOrder = () => {
  const context = useContext(DirectOrderContext);
  if (context === undefined) {
    throw new Error('useDirectOrder must be used within a DirectOrderProvider');
  }
  return context;
};

export const DirectOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderItem, setOrderItemState] = useState<DirectOrderItem | null>(null);
  const { toast } = useToast();

  // Load order from sessionStorage on mount (use session instead of local for temporary orders)
  useEffect(() => {
    const savedOrder = sessionStorage.getItem('suraah_direct_order');
    if (savedOrder) {
      try {
        setOrderItemState(JSON.parse(savedOrder));
      } catch (error) {
        console.error('Error loading order from sessionStorage:', error);
      }
    }
  }, []);

  // Save order to sessionStorage whenever it changes
  useEffect(() => {
    if (orderItem) {
      sessionStorage.setItem('suraah_direct_order', JSON.stringify(orderItem));
    } else {
      sessionStorage.removeItem('suraah_direct_order');
    }
  }, [orderItem]);

  const setOrderItem = (item: DirectOrderItem) => {
    setOrderItemState(item);
    toast({
      title: "Ready to Order",
      description: `${item.name} is ready for checkout`,
    });
  };

  const clearOrder = () => {
    setOrderItemState(null);
    sessionStorage.removeItem('suraah_direct_order');
  };

  const updateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      clearOrder();
      return;
    }

    if (orderItem) {
      setOrderItemState({ ...orderItem, quantity });
    }
  };

  const getTotalPrice = () => {
    return orderItem ? orderItem.price * orderItem.quantity : 0;
  };

  const getTotalItems = () => {
    return orderItem ? orderItem.quantity : 0;
  };

  return (
    <DirectOrderContext.Provider value={{
      orderItem,
      setOrderItem,
      clearOrder,
      updateQuantity,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </DirectOrderContext.Provider>
  );
};