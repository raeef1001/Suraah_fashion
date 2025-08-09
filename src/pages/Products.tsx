import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import product1 from '@/assets/product-1.webp';
import product2 from '@/assets/product-2.webp';

import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const { products: allProducts, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: 'all',
    inStock: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    const priceRangeFromUrl = searchParams.get('priceRange');
    const inStockFromUrl = searchParams.get('inStock');
    
    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl || '',
      priceRange: priceRangeFromUrl || 'all',
      inStock: inStockFromUrl === 'true'
    }));
    
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // Get categories from database
  const { categories: dbCategories } = useCategories();
  const activeCategories = dbCategories
    .filter(category => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  
  const sidebarCategories = ['All Products', ...activeCategories.map(cat => cat.name)];

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ৳1000', value: '0-1000' },
    { label: '৳1000 - ৳2000', value: '1000-2000' },
    { label: '৳2000 - ৳3000', value: '2000-3000' },
    { label: 'Above ৳3000', value: '3000+' }
  ];

  // Filter products based on current filters and search
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (filters.category && filters.category !== 'ALL PRODUCT' && filters.category !== 'All Products') {
      if (product.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower) && 
          !product.description.toLowerCase().includes(searchLower) &&
          !product.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false;
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const price = product.price;
      switch (filters.priceRange) {
        case '0-1000':
          if (price >= 1000) return false;
          break;
        case '1000-2000':
          if (price < 1000 || price >= 2000) return false;
          break;
        case '2000-3000':
          if (price < 2000 || price >= 3000) return false;
          break;
        case '3000+':
          if (price < 3000) return false;
          break;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {filters.category && filters.category !== 'ALL PRODUCT' ? filters.category : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filters.category && filters.category !== 'ALL PRODUCT' 
              ? `Browse our ${filters.category.toLowerCase()} collection` 
              : 'Discover our complete collection of traditional Panjabi clothing'
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Update URL with search parameter
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          if (e.target.value) {
                            newParams.set('search', e.target.value);
                          } else {
                            newParams.delete('search');
                          }
                          return newParams;
                        });
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Categories</label>
                  <div className="space-y-2">
                    {sidebarCategories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${index}`}
                          checked={
                            category === 'All Products' 
                              ? !filters.category || filters.category === 'ALL PRODUCT'
                              : filters.category === category.toUpperCase()
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (category === 'All Products') {
                                setFilters(prev => ({ ...prev, category: '' }));
                                setSearchParams(prev => {
                                  const newParams = new URLSearchParams(prev);
                                  newParams.delete('category');
                                  return newParams;
                                });
                              } else {
                                setFilters(prev => ({ ...prev, category: category.toUpperCase() }));
                                setSearchParams(prev => {
                                  const newParams = new URLSearchParams(prev);
                                  newParams.set('category', category.toUpperCase());
                                  return newParams;
                                });
                              }
                            }
                          }}
                        />
                        <label htmlFor={`category-${index}`} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Price Range</label>
                  <Select 
                    value={filters.priceRange} 
                    onValueChange={(value) => {
                      setFilters(prev => ({ ...prev, priceRange: value }));
                      // Update URL with price range parameter
                      setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        if (value !== 'all') {
                          newParams.set('priceRange', value);
                        } else {
                          newParams.delete('priceRange');
                        }
                        return newParams;
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range, index) => (
                        <SelectItem key={index} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="in-stock" 
                      checked={filters.inStock}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({ ...prev, inStock: checked as boolean }));
                        // Update URL with stock parameter
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          if (checked) {
                            newParams.set('inStock', 'true');
                          } else {
                            newParams.delete('inStock');
                          }
                          return newParams;
                        });
                      }}
                    />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex-1">

            {/* Products Grid */}
            {loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Products</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in">
                    <ProductCard 
                      id={product.id}
                      title={product.name}
                      code={product.sku}
                      originalPrice={product.originalPrice || product.price}
                      salePrice={product.price}
                      discount={(product.originalPrice || product.price) - product.price}
                      images={product.images}
                      inStock={product.inStock}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;