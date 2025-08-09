import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useDirectOrder } from '@/contexts/DirectOrderContext';
import { useProduct, useFeaturedProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveImagePath } from '@/utils/imageUtils';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setOrderItem } = useDirectOrder();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { product, loading: productLoading, error: productError } = useProduct(id || '');
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(8);
  const relatedProducts = featuredProducts.filter(p => p.id !== id).slice(0, 4);

  // Resolve product images
  const resolvedImages = product ? product.images.map(img => {
    const resolved = resolveImagePath(img);
    console.log('🖼️ Product detail image:', img, '→', resolved);
    return resolved;
  }) : [];

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {productError || 'The product you are looking for does not exist.'}
            </p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "Size selection is required for this product",
        variant: "destructive"
      });
      return;
    }

    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        description: "Color selection is required for this product",
        variant: "destructive"
      });
      return;
    }

    setOrderItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: quantity,
      image: resolvedImages[0] || product.images[0],
      size: selectedSize,
      color: selectedColor,
      category: product.category
    });

    navigate('/checkout');
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={resolvedImages[selectedImage] || resolvedImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('❌ Product detail image failed to load:', resolvedImages[selectedImage]);
                  console.log('Available images:', resolvedImages);
                }}
                onLoad={() => {
                  console.log('✅ Product detail image loaded:', resolvedImages[selectedImage]);
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {resolvedImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {resolvedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      Save ৳{(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>

            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {product.stockQuantity} items available
              </p>
            </div>

            {/* Buy Now */}
            <div className="flex gap-4">
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {!product.inStock ? 'Out of Stock' : 'Buy Now'}
              </Button>
            </div>

            {/* Product Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={resolveImagePath(relatedProduct.images[0])}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{relatedProduct.name}</h3>
                      <p className="text-lg font-bold text-primary">
                        ৳{relatedProduct.price.toLocaleString()}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;