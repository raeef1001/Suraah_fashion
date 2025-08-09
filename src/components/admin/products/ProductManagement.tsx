import { useState, useEffect } from 'react';
import { useRealtimeProducts, useProductMutations } from '@/hooks/useProducts';
import { useRealtimeCategories } from '@/hooks/useCategories';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Package,
  Grid,
  List,
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Upload,
  X,
  ImageIcon,
  Palette
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
import { FirestoreProduct } from '@/types/firestore';
import { processImagesForUpload, validateImageFile } from '@/utils/imageUpload';

interface ProductManagementProps {
  triggerAddNew?: number;
}

const ProductManagement = ({ triggerAddNew }: ProductManagementProps) => {
  const { products, loading, error } = useRealtimeProducts();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const { categories, loading: categoriesLoading } = useRealtimeCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    stockQuantity: 0,
    features: [] as string[],
    fabric: '',
    care: [] as string[],
    sku: '',
    tags: [] as string[],
    specifications: {} as Record<string, string>,
    images: [] as string[]
  });

  // Additional form states for new features
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handle triggerAddNew prop
  useEffect(() => {
    if (triggerAddNew && triggerAddNew > 0) {
      setIsAddDialogOpen(true);
    }
  }, [triggerAddNew]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'in-stock' && product.inStock) ||
                           (filterStatus === 'out-of-stock' && !product.inStock);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        case 'created':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        default:
          return 0;
      }
    });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      sizes: [],
      colors: [],
      inStock: true,
      stockQuantity: 0,
      features: [],
      fabric: '',
      care: [],
      sku: '',
      tags: [],
      specifications: {},
      images: []
    });
    setImageFiles([]);
    setImagePreviews([]);
    setNewSize('');
    setNewColor('');
    setIsUploading(false);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEdit = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      features: product.features,
      fabric: product.fabric,
      care: product.care,
      sku: product.sku,
      tags: product.tags,
      specifications: product.specifications,
      images: product.images || []
    });
    setImagePreviews(product.images || []);
    setImageFiles([]);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      
      // Process images if any new files were uploaded
      let finalImages = [...formData.images];
      if (imageFiles.length > 0) {
        const uploadResults = await processImagesForUpload(imageFiles);
        const newImageUrls = uploadResults.map(result => result.url);
        finalImages = [...finalImages, ...newImageUrls];
      }

      const productData = {
        ...formData,
        images: finalImages,
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        setIsEditDialogOpen(false);
      } else {
        await createProduct(productData);
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processNewImages(files);
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    processNewImages(files);
  };

  const processNewImages = (files: File[]) => {
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      } else {
        console.error(`Invalid file ${file.name}: ${validation.error}`);
      }
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      // Remove from existing images
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
      
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    } else {
      // Remove from new uploads
      const existingCount = formData.images.length;
      const newIndex = index - existingCount;
      
      const newFiles = [...imageFiles];
      newFiles.splice(newIndex, 1);
      setImageFiles(newFiles);
      
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    }
  };

  // Size handling functions
  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()]
      });
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData({ ...formData, sizes: newSizes });
  };

  const addPresetSize = (size: string) => {
    if (!formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size]
      });
    }
  };

  // Color handling functions
  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor.trim()]
      });
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    const newColors = [...formData.colors];
    newColors.splice(index, 1);
    setFormData({ ...formData, colors: newColors });
  };

  const addPresetColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
    }
  };

  // Preset options
  const presetSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
  const presetColors = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Blue', 'Green', 'Brown', 'Pink', 'Purple'];

  const getStockStatus = (product: FirestoreProduct) => {
    if (!product.inStock) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (product.stockQuantity <= 5) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <p className="mt-2 text-destructive">Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.inStock).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.inStock && p.stockQuantity <= 5).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map(p => p.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your product inventory and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{product.stockQuantity} units</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? 'Update the product information below.'
                : 'Fill in the details to create a new product.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </h3>
              
              {/* Image Upload Area */}
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to select
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Choose Images
                </Button>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index, index < formData.images.length)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Sizes</h3>
              
              {/* Preset Sizes */}
              <div className="space-y-2">
                <Label>Quick Add Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {presetSizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={formData.sizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addPresetSize(size)}
                      disabled={formData.sizes.includes(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Size Input */}
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Enter custom size"
                  onKeyPress={(e) => e.key === 'Enter' && addSize()}
                />
                <Button type="button" onClick={addSize} disabled={!newSize.trim()}>
                  Add Size
                </Button>
              </div>

              {/* Selected Sizes */}
              {formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {size}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSize(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Available Colors
              </h3>
              
              {/* Preset Colors */}
              <div className="space-y-2">
                <Label>Quick Add Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={formData.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addPresetColor(color)}
                      disabled={formData.colors.includes(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter custom color"
                  onKeyPress={(e) => e.key === 'Enter' && addColor()}
                />
                <Button type="button" onClick={addColor} disabled={!newColor.trim()}>
                  Add Color
                </Button>
              </div>

              {/* Selected Colors */}
              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {color}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeColor(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing and Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing & Inventory</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="" disabled>Loading categories...</SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value="" disabled>No categories available</SelectItem>
                    ) : (
                      categories.filter(cat => cat.isActive).map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {selectedProduct ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                selectedProduct ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;