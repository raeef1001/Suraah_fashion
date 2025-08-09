import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Truck, Phone, MapPin, User, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDirectOrder } from '@/contexts/DirectOrderContext';
import { useToast } from '@/hooks/use-toast';

const OrderConfirmPage = () => {
  const { orderItem, getTotalPrice, getTotalItems, clearOrder } = useDirectOrder();
  const { toast } = useToast();
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    notes: ''
  });

  // Payment and Delivery
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const totalAmount = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingFee = totalAmount > 2000 ? 0 : 60;
  const finalTotal = totalAmount + shippingFee;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!customerInfo.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }
    
    if (!customerInfo.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!orderItem) {
      toast({
        title: "No Item Selected",
        description: "Please select an item before placing an order.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderNumber(orderNum);
      
      // Clear order and show success
      clearOrder();
      setOrderPlaced(true);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNum} has been confirmed.`,
      });
      
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
                <p className="text-lg text-green-600 mb-4">Thank you for your purchase, {customerInfo.name}!</p>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-2xl font-bold text-luxury-gold">{orderNumber}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>📱 We will contact you at: <strong>{customerInfo.phone}</strong></p>
                  <p>📍 Delivery to: <strong>{customerInfo.address}, {customerInfo.city}</strong></p>
                  <p>💰 Total Amount: <strong>Tk{finalTotal.toLocaleString()}</strong></p>
                  <p>🚚 Expected Delivery: <strong>3-5 business days</strong></p>
                </div>

                <div className="space-y-3">
                  <Link to="/products">
                    <Button variant="traditional" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Link to="/">
                    <Button variant="outline" size="lg" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orderItem) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No item selected</h2>
            <p className="text-muted-foreground mb-6">
              Please select an item before proceeding to checkout.
            </p>
            <Link to="/products">
              <Button variant="traditional" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div className="ml-4">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House/Flat, Road, Area"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g., Dhaka"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={customerInfo.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="e.g., Dhanmondi"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                          </div>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                      <RadioGroupItem value="online" id="online" disabled />
                      <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-muted-foreground">bKash, Nagad, Card (Coming Soon)</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
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
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Standard Delivery</p>
                            <p className="text-sm text-muted-foreground">3-5 business days</p>
                          </div>
                          <span className="text-sm font-medium">
                            {shippingFee === 0 ? 'Free' : `Tk${shippingFee}`}
                          </span>
                        </div>
                      </Label>
                    </div>
                    
                  </RadioGroup>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {orderItem && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={orderItem.image}
                        alt={orderItem.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{orderItem.name}</p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          {orderItem.size && <span>Size: {orderItem.size}</span>}
                          {orderItem.color && <span>• Color: {orderItem.color}</span>}
                          <span>• Qty: {orderItem.quantity}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        Tk{(orderItem.price * orderItem.quantity).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>Tk{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `Tk${shippingFee}`
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-luxury-gold">Tk{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="traditional"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Placing Order...
                    </div>
                  ) : (
                    `Place Order - Tk${finalTotal.toLocaleString()}`
                  )}
                </Button>

                {/* Security Info */}
                <div className="pt-4 border-t text-center">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>🔒 Secure checkout</p>
                    <p>📞 Call support: 01708771510</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmPage;