import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderMutations } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { OrderInput } from '@/services/orderService';

interface OrderFormProps {
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

const OrderForm = ({ onSuccess, onCancel }: OrderFormProps) => {
  const { placeOrder, loading } = useOrderMutations();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<OrderInput>>({
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh'
    },
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.customerInfo?.name || !formData.customerInfo?.email || !formData.customerInfo?.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all customer information fields",
          variant: "destructive"
        });
        return;
      }

      if (!formData.shippingAddress?.street || !formData.shippingAddress?.city) {
        toast({
          title: "Validation Error", 
          description: "Please fill in shipping address",
          variant: "destructive"
        });
        return;
      }

      // For demo purposes, create a sample order with empty items
      // In real implementation, this would come from cart or be selected
      const orderData: OrderInput = {
        customerInfo: formData.customerInfo!,
        items: [], // This would be populated with actual cart items
        totalAmount: 0, // This would be calculated from items
        shippingAddress: formData.shippingAddress!,
        billingAddress: formData.billingAddress,
        notes: formData.notes
      };

      const orderId = await placeOrder(orderData);
      
      toast({
        title: "Order Created",
        description: `Order ${orderId} has been created successfully`,
      });

      if (onSuccess) {
        onSuccess(orderId);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const updateCustomerInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo!,
        [field]: value
      }
    }));
  };

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress!,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter customer details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerInfo?.name || ''}
                onChange={(e) => updateCustomerInfo('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerInfo?.email || ''}
                onChange={(e) => updateCustomerInfo('email', e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input
              id="customerPhone"
              value={formData.customerInfo?.phone || ''}
              onChange={(e) => updateCustomerInfo('phone', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>Enter delivery address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.shippingAddress?.street || ''}
              onChange={(e) => updateShippingAddress('street', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.shippingAddress?.city || ''}
                onChange={(e) => updateShippingAddress('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State/Division</Label>
              <Input
                id="state"
                value={formData.shippingAddress?.state || ''}
                onChange={(e) => updateShippingAddress('state', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={formData.shippingAddress?.zipCode || ''}
                onChange={(e) => updateShippingAddress('zipCode', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.shippingAddress?.country || 'Bangladesh'}
              onChange={(e) => updateShippingAddress('country', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
          <CardDescription>Additional information (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any special instructions or notes..."
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;