import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreProducts = () => {
    setLoadingMore(true);
    // Simulate API call
    setTimeout(() => {
      setVisibleProducts(prev => prev + 8);
      setLoadingMore(false);
    }, 1000);
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">LATEST PRODUCTS</h2>
            <Link to="/products">
              <Button variant="traditional" className="hidden md:inline-flex">
                See All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Products</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">LATEST PRODUCTS</h2>
          <Link to="/products">
            <Button variant="traditional" className="hidden md:inline-flex">
              See All
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.slice(0, visibleProducts).map((product) => (
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

        {/* Load More Button */}
        {visibleProducts < products.length && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={loadMoreProducts}
              disabled={loadingMore}
              className="px-8 py-3 border-2 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading...
                </div>
              ) : (
                'Load More Products'
              )}
            </Button>
          </div>
        )}

        {/* Mobile See All Button */}
        <div className="md:hidden text-center mt-6">
          <Link to="/products">
            <Button variant="traditional" className="w-full max-w-xs">
              See All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;