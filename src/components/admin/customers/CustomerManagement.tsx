import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreHorizontal,
  Users
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

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample customer data
  const customers = [
    {
      id: 'CUST-001',
      name: 'রহিম উদ্দিন',
      email: 'rahim@example.com',
      phone: '01708771510',
      address: 'ঢাকা, বাংলাদেশ',
      totalOrders: 5,
      totalSpent: 8450,
      status: 'Active',
      joinDate: '2024-01-10',
      lastOrder: '2024-01-15'
    },
    {
      id: 'CUST-002',
      name: 'করিম আহমেদ',
      email: 'karim@example.com',
      phone: '01708771511',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      totalOrders: 3,
      totalSpent: 5670,
      status: 'Active',
      joinDate: '2024-01-08',
      lastOrder: '2024-01-14'
    },
    {
      id: 'CUST-003',
      name: 'নাসির হোসেন',
      email: 'nasir@example.com',
      phone: '01708771512',
      address: 'সিলেট, বাংলাদেশ',
      totalOrders: 2,
      totalSpent: 3999,
      status: 'Active',
      joinDate: '2024-01-05',
      lastOrder: '2024-01-13'
    },
    {
      id: 'CUST-004',
      name: 'আব্দুল হক',
      email: 'abdul@example.com',
      phone: '01708771513',
      address: 'রাজশাহী, বাংলাদেশ',
      totalOrders: 1,
      totalSpent: 1450,
      status: 'Inactive',
      joinDate: '2024-01-01',
      lastOrder: '2024-01-10'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Blocked': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-luxury-gold" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'Active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Orders</p>
                <p className="text-2xl font-bold">
                  {(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ৳{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-burnt-orange" />
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
              placeholder="Search customers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers ({filteredCustomers.length})
          </CardTitle>
          <CardDescription>
            Manage customer accounts and view purchase history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium font-bengali">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bengali">
                          <MapPin className="h-3 w-3" />
                          {customer.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.totalOrders} orders</p>
                        <p className="text-sm text-muted-foreground">
                          Last: {formatDate(customer.lastOrder)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-luxury-gold">৳{customer.totalSpent.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(customer.joinDate)}
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
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
  );
};

export default CustomerManagement;