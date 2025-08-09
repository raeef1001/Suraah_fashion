import { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Eye
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

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample inventory data
  const inventory = [
    {
      id: 'SKU-00477',
      name: 'Premium Pocket Design Panjabi 2025',
      category: 'Premium Panjabi',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      reorderPoint: 15,
      costPrice: 1200,
      sellingPrice: 1690,
      supplier: 'Dhaka Textiles Ltd',
      lastRestocked: '2024-01-10',
      status: 'In Stock',
      location: 'Warehouse A-1'
    },
    {
      id: 'SKU-00476',
      name: 'Luxury Embroidery Collection Special',
      category: 'Embroidery Panjabi',
      currentStock: 5,
      minStock: 8,
      maxStock: 50,
      reorderPoint: 10,
      costPrice: 2000,
      sellingPrice: 2890,
      supplier: 'Bengal Crafts',
      lastRestocked: '2024-01-08',
      status: 'Low Stock',
      location: 'Warehouse B-2'
    },
    {
      id: 'SKU-00475',
      name: 'Traditional Print Panjabi Classic',
      category: 'Print Panjabi',
      currentStock: 0,
      minStock: 5,
      maxStock: 75,
      reorderPoint: 8,
      costPrice: 1000,
      sellingPrice: 1450,
      supplier: 'Chittagong Prints',
      lastRestocked: '2024-01-05',
      status: 'Out of Stock',
      location: 'Warehouse A-3'
    },
    {
      id: 'SKU-00474',
      name: 'Solid Color Premium Collection',
      category: 'Solid Panjabi',
      currentStock: 45,
      minStock: 15,
      maxStock: 80,
      reorderPoint: 20,
      costPrice: 1300,
      sellingPrice: 1780,
      supplier: 'Sylhet Fabrics',
      lastRestocked: '2024-01-12',
      status: 'In Stock',
      location: 'Warehouse C-1'
    },
    {
      id: 'SKU-00473',
      name: 'Special Edition Combo Package',
      category: 'Combo Package',
      currentStock: 3,
      minStock: 5,
      maxStock: 25,
      reorderPoint: 7,
      costPrice: 2800,
      sellingPrice: 3999,
      supplier: 'Premium Collections',
      lastRestocked: '2024-01-09',
      status: 'Low Stock',
      location: 'Warehouse B-1'
    }
  ];

  const categories = [
    'Premium Panjabi',
    'Embroidery Panjabi',
    'Print Panjabi',
    'Solid Panjabi',
    'Combo Package',
    'Koti',
    'Trouser'
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase().replace(' ', '') === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'default';
      case 'Low Stock': return 'secondary';
      case 'Out of Stock': return 'destructive';
      case 'Overstocked': return 'outline';
      default: return 'outline';
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    if (current >= max * 0.9) return 'Overstocked';
    return 'In Stock';
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-luxury-gold" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">৳{totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
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
              placeholder="Search inventory..."
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
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="lowstock">Low Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="traditional">
            <RefreshCw className="h-4 w-4 mr-2" />
            Restock
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory ({filteredInventory.length})
          </CardTitle>
          <CardDescription>
            Monitor stock levels and manage inventory across all locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Stock Levels</TableHead>
                  <TableHead>Cost/Selling Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock);
                  const needsReorder = item.currentStock <= item.reorderPoint;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.id}</p>
                          <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{item.currentStock}</span>
                          {needsReorder && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>Min: <span className="font-medium">{item.minStock}</span></p>
                          <p>Reorder: <span className="font-medium">{item.reorderPoint}</span></p>
                          <p>Max: <span className="font-medium">{item.maxStock}</span></p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cost: ৳{item.costPrice}</p>
                          <p className="font-medium">Sell: ৳{item.sellingPrice}</p>
                          <p className="text-xs text-green-600">
                            Margin: {(((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.supplier}</p>
                          <p className="text-sm text-muted-foreground">
                            Last: {new Date(item.lastRestocked).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.location}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(stockLevel)}>
                          {stockLevel}
                        </Badge>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reorder Now
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;