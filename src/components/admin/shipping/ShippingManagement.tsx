import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck,
  MapPin,
  Clock,
  DollarSign,
  MoreHorizontal,
  Package
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
import { Switch } from '@/components/ui/switch';

const ShippingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample shipping data
  const shippingMethods = [
    {
      id: 'SHIP-001',
      name: 'ঢাকার ভিতরে হোম ডেলিভারি',
      nameEn: 'Dhaka Home Delivery',
      zone: 'Dhaka City',
      cost: 60,
      estimatedDays: '1-2',
      status: 'Active',
      description: 'ঢাকা শহরের যেকোনো এলাকায় ২৪ ঘন্টার মধ্যে ডেলিভারি',
      minOrder: 0,
      maxWeight: 5
    },
    {
      id: 'SHIP-002',
      name: 'ঢাকার বাইরে কুরিয়ার',
      nameEn: 'Outside Dhaka Courier',
      zone: 'Outside Dhaka',
      cost: 120,
      estimatedDays: '3-5',
      status: 'Active',
      description: 'ঢাকার বাইরে সারাদেশে কুরিয়ার সেবা',
      minOrder: 500,
      maxWeight: 10
    },
    {
      id: 'SHIP-003',
      name: 'এক্সপ্রেস ডেলিভারি',
      nameEn: 'Standard Delivery',
      zone: 'Dhaka City',
      cost: 150,
      estimatedDays: '1',
      status: 'Active',
      description: 'জরুরি ডেলিভারির জন্য একই দিনে পৌঁছে যাবে',
      minOrder: 1000,
      maxWeight: 3
    },
    {
      id: 'SHIP-004',
      name: 'ফ্রি ডেলিভারি',
      nameEn: 'Free Delivery',
      zone: 'All Bangladesh',
      cost: 0,
      estimatedDays: '3-7',
      status: 'Active',
      description: '৩০০০ টাকার উপরে অর্ডারে ফ্রি ডেলিভারি',
      minOrder: 3000,
      maxWeight: 15
    },
    {
      id: 'SHIP-005',
      name: 'পিকআপ পয়েন্ট',
      nameEn: 'Pickup Point',
      zone: 'Dhaka City',
      cost: 0,
      estimatedDays: '1-2',
      status: 'Inactive',
      description: 'নির্দিষ্ট পিকআপ পয়েন্ট থেকে সংগ্রহ করুন',
      minOrder: 0,
      maxWeight: 20
    }
  ];

  const deliveryZones = [
    { name: 'ঢাকা সিটি', orders: 245, avgTime: '1.2 days' },
    { name: 'চট্টগ্রাম', orders: 89, avgTime: '3.1 days' },
    { name: 'সিলেট', orders: 67, avgTime: '3.5 days' },
    { name: 'রাজশাহী', orders: 54, avgTime: '4.2 days' },
    { name: 'খুলনা', orders: 43, avgTime: '4.0 days' },
    { name: 'বরিশাল', orders: 32, avgTime: '4.5 days' }
  ];

  const filteredMethods = shippingMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || method.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Shipping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Methods</p>
                <p className="text-2xl font-bold">{shippingMethods.filter(m => m.status === 'Active').length}</p>
              </div>
              <Truck className="h-8 w-8 text-luxury-gold" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Delivery</p>
                <p className="text-2xl font-bold">2.8 days</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Zones</p>
                <p className="text-2xl font-bold">{deliveryZones.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Cost</p>
                <p className="text-2xl font-bold">৳{Math.round(shippingMethods.reduce((sum, m) => sum + m.cost, 0) / shippingMethods.length)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-burnt-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-grey" />
                <Input
                  placeholder="Search shipping methods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="traditional">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>

          {/* Shipping Methods Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Methods ({filteredMethods.length})
              </CardTitle>
              <CardDescription>
                Manage delivery options and shipping rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium font-bengali">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.nameEn}</p>
                            <p className="text-xs text-muted-foreground font-bengali">{method.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{method.zone}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-luxury-gold">
                              {method.cost === 0 ? 'Free' : `৳${method.cost}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Min: ৳{method.minOrder}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{method.estimatedDays} days</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(method.status)}>
                              {method.status}
                            </Badge>
                            <Switch 
                              checked={method.status === 'Active'} 
                              size="sm"
                            />
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
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Method
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="h-4 w-4 mr-2" />
                                View Orders
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Method
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Zones */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Zones
              </CardTitle>
              <CardDescription>
                Popular delivery areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryZones.map((zone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium font-bengali">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">{zone.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{zone.avgTime}</p>
                      <p className="text-xs text-muted-foreground">avg time</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">৳3000+ orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">COD Available</p>
                  <p className="text-sm text-muted-foreground">Cash on delivery</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingManagement;