import { useState, useEffect } from 'react';
import { useRealtimeCategories, useCategoryMutations } from '@/hooks/useCategories';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Tag,
  Grid,
  List,
  ArrowUpDown,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface CategoryManagementProps {
  triggerAddNew?: number;
}

const CategoryManagement = ({ triggerAddNew }: CategoryManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Use real database hooks
  const { categories, loading, error } = useRealtimeCategories();
  const { addCategory, editCategory, deleteCategory, loading: mutationLoading } = useCategoryMutations();

  // Handle triggerAddNew from parent component
  useEffect(() => {
    if (triggerAddNew && triggerAddNew > 0) {
      setIsAddDialogOpen(true);
    }
  }, [triggerAddNew]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
    sortOrder: categories.length + 1
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && category.isActive) ||
                         (selectedFilter === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const handleAddCategory = async () => {
    try {
      await addCategory({
        ...newCategory,
        sortOrder: categories.length + 1
      });
      setNewCategory({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true,
        sortOrder: categories.length + 2
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      await editCategory(categoryId, { isActive: !currentStatus });
    } catch (error) {
      console.error('Failed to update category status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading categories: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-luxury-gold" />
              <div>
                <p className="text-sm font-medium">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Grid className="h-4 w-4 text-burnt-orange" />
              <div>
                <p className="text-sm font-medium">Active Categories</p>
                <p className="text-2xl font-bold">{categories.filter(cat => cat.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-deep-navy" />
              <div>
                <p className="text-sm font-medium">Inactive Categories</p>
                <p className="text-2xl font-bold">{categories.filter(cat => !cat.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <List className="h-4 w-4 text-charcoal-grey" />
              <div>
                <p className="text-sm font-medium">Sort Order Range</p>
                <p className="text-2xl font-bold">{categories.length > 0 ? `1-${Math.max(...categories.map(cat => cat.sortOrder))}` : '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category Management
              </CardTitle>
              <CardDescription>
                Organize your product categories and subcategories
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              >
                {viewMode === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="traditional">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new product category for your store
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Category name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imageUrl" className="text-right">
                        Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        value={newCategory.imageUrl}
                        onChange={(e) => setNewCategory({...newCategory, imageUrl: e.target.value})}
                        className="col-span-3"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        className="col-span-3"
                        placeholder="Category description"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="active" className="text-right">
                        Active
                      </Label>
                      <Switch
                        id="active"
                        checked={newCategory.isActive}
                        onCheckedChange={(checked) => setNewCategory({...newCategory, isActive: checked})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="traditional" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {category.imageUrl && (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {category.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.sortOrder}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;