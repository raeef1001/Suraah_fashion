import { useState, useEffect } from 'react';
import { useOrders, useOrderMutations } from '@/hooks/useOrders';
import { FirestoreOrder } from '@/types/firestore';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderManagementProps {
  triggerAddNew?: number;
}

const OrderManagement = ({ triggerAddNew }: OrderManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<FirestoreOrder['status']>('pending');

  // Use real database hooks
  const { orders, loading, error, refetch } = useOrders();
  const { updateStatus, updatePayment, loading: mutationLoading } = useOrderMutations();

  // Handle triggerAddNew from parent component
  useEffect(() => {
    if (triggerAddNew && triggerAddNew > 0) {
      // For orders, "Add New" could mean create a manual order
      console.log('Creating new order - this would open an order creation dialog');
    }
  }, [triggerAddNew]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-8" />
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading orders: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'confirmed': return 'outline';
      case 'pending': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handler functions
  const handleViewDetails = (order: FirestoreOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (order: FirestoreOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusUpdateOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateStatus(selectedOrder.id, newStatus);
      setIsStatusUpdateOpen(false);
      setSelectedOrder(null);
      await refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-luxury-gold" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-burnt-orange" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-grey" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Manage customer orders and track deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">#{order.id.slice(-4).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(order.orderDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm">
                            {item.quantity}x {item.productName}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-luxury-gold">${order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{order.paymentStatus}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{formatDate(order.orderDate)}</p>
                        {order.deliveryDate && (
                          <p className="text-xs text-muted-foreground">
                            Delivered: {formatDate(order.deliveryDate)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No orders have been placed yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - #{selectedOrder?.id.slice(-4).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Complete order information and customer details
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Order Date: {formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(selectedOrder.status)} className="flex items-center gap-1">
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Payment: {selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="text-lg font-bold text-luxury-gold">
                      Total: ${selectedOrder.totalAmount.toLocaleString()}
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="text-sm">
                        <span className="font-medium">Tracking: </span>
                        {selectedOrder.trackingNumber}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedOrder.customerInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.customerInfo.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items and Shipping */}
              <div className="space-y-4">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toLocaleString()}
                            </p>
                            {item.size && (
                              <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-xs text-muted-foreground">Color: {item.color}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.quantity * item.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id.slice(-4).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Status</label>
              <div className="mt-1">
                <Badge variant={selectedOrder ? getStatusColor(selectedOrder.status) : 'outline'} className="flex items-center gap-1 w-fit">
                  {selectedOrder && getStatusIcon(selectedOrder.status)}
                  {selectedOrder?.status.charAt(0).toUpperCase() + selectedOrder?.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(value: FirestoreOrder['status']) => setNewStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsStatusUpdateOpen(false)}
                disabled={mutationLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={mutationLoading || newStatus === selectedOrder?.status}
              >
                {mutationLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;