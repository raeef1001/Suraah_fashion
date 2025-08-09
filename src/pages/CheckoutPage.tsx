import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Mail, User, Minus, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useDirectOrder } from '@/contexts/DirectOrderContext';
import { useOrderMutations } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { resolveImagePath } from '@/utils/imageUtils';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { orderItem, getTotalPrice, getTotalItems, clearOrder, updateQuantity } = useDirectOrder();
  const { placeOrder, loading } = useOrderMutations();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    customerPhone: '',
    
    // Shipping Address
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'Bangladesh',
    
    // Payment & Delivery
    paymentMethod: 'cod', // Only COD
    deliveryMethod: 'standard', // only standard
    
    // Additional
    orderNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingFee = totalAmount > 2000 ? 0 : 60;
  const expressFee = 0;
  const finalTotal = totalAmount + shippingFee + expressFee;

  // Redirect if no order item
  if (!orderItem) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">No item selected</h1>
            <p className="text-muted-foreground mb-6">
              Please select an item to purchase before proceeding to checkout.
            </p>
            <Link to="/products">
              <Button variant="traditional" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.shippingStreet.trim()) newErrors.shippingStreet = 'Street address is required';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.customerPhone && !phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const orderData = {
        customerInfo: {
          name: formData.customerName,
          email: `${formData.customerPhone}@customer.local`, // Generate dummy email
          phone: formData.customerPhone
        },
        items: orderItem ? [orderItem] : [],
        totalAmount: finalTotal,
        shippingAddress: {
          street: formData.shippingStreet,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZip,
          country: formData.shippingCountry
        },
        notes: formData.orderNotes
      };

      const orderId = await placeOrder(orderData);
      
      // Clear order after successful order
      clearOrder();
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed.`,
      });

      navigate(`/order-confirm/${orderId}`);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.customerName ? 'border-destructive' : ''}
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className={errors.customerPhone ? 'border-destructive' : ''}
                      />
                      {errors.customerPhone && (
                        <p className="text-sm text-destructive mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingStreet">Street Address *</Label>
                    <Input
                      id="shippingStreet"
                      value={formData.shippingStreet}
                      onChange={(e) => handleInputChange('shippingStreet', e.target.value)}
                      placeholder="House/Flat, Road, Area"
                      className={errors.shippingStreet ? 'border-destructive' : ''}
                    />
                    {errors.shippingStreet && (
                      <p className="text-sm text-destructive mt-1">{errors.shippingStreet}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">City *</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                        placeholder="Dhaka"
                        className={errors.shippingCity ? 'border-destructive' : ''}
                      />
                      {errors.shippingCity && (
                        <p className="text-sm text-destructive mt-1">{errors.shippingCity}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingZip">Postal Code</Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingZip}
                        onChange={(e) => handleInputChange('shippingZip', e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Standard Delivery</p>
                            <p className="text-sm text-muted-foreground">3-5 business days</p>
                          </div>
                          <span className="font-medium">
                            {shippingFee === 0 ? 'Free' : `Tk${shippingFee}`}
                          </span>
                        </div>
                      </Label>
                    </div>
                    
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.orderNotes}
                    onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                    placeholder="Any special instructions for your order..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Item */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={resolveImagePath(orderItem.image)}
                        alt={orderItem.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{orderItem.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {orderItem.quantity} × Tk{orderItem.price.toLocaleString()}
                        </p>
                        {orderItem.size && (
                          <p className="text-xs text-muted-foreground">Size: {orderItem.size}</p>
                        )}
                        {orderItem.color && (
                          <p className="text-xs text-muted-foreground">Color: {orderItem.color}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          Tk{(orderItem.price * orderItem.quantity).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(orderItem.quantity - 1)}
                            disabled={orderItem.quantity <= 1}
                            type="button"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs w-8 text-center">{orderItem.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(orderItem.quantity + 1)}
                            type="button"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>Tk{totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `Tk${shippingFee}`
                        )}
                      </span>
                    </div>


                    <Separator />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>Tk{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="traditional" 
                    size="lg" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;