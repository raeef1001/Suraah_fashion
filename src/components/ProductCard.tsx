import { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useDirectOrder } from '@/contexts/DirectOrderContext';
import { resolveImagePath } from '@/utils/imageUtils';

interface ProductCardProps {
  id: string;
  title: string;
  code: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  images: string[];
  inStock?: boolean;
  category?: string;
}

const ProductCard = ({ 
  id, 
  title, 
  code, 
  originalPrice, 
  salePrice, 
  discount, 
  images, 
  inStock = true,
  category = "Panjabi"
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { setOrderItem } = useDirectOrder();
  const navigate = useNavigate();

  // Resolve image paths and add debugging
  const resolvedImages = images.map(img => {
    const resolved = resolveImagePath(img);
    if (import.meta.env.DEV) {
      console.log('🖼️ Resolving image:', img, '→', resolved);
    }
    return resolved;
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    setOrderItem({
      id,
      name: title,
      price: salePrice,
      originalPrice: originalPrice > salePrice ? originalPrice : undefined,
      quantity: 1,
      image: resolvedImages[0],
      category
    });
    
    navigate('/checkout');
  };

  return (
    <Card
      className="product-card group relative overflow-hidden border-0 shadow-card hover:shadow-product transition-all duration-300 bg-off-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${id}`} className="block">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-[3/4] bg-muted">
            <img
              src={resolvedImages[currentImageIndex] || resolvedImages[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                console.error('❌ Image failed to load:', resolvedImages[currentImageIndex]);
                console.log('Original image path:', images[currentImageIndex]);
                console.log('Available images:', resolvedImages);
                // Try next image if available
                if (currentImageIndex < resolvedImages.length - 1) {
                  setCurrentImageIndex(currentImageIndex + 1);
                }
              }}
              onLoad={() => {
                console.log('✅ Image loaded successfully:', resolvedImages[currentImageIndex]);
              }}
            />

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-burnt-orange text-off-white font-bold px-2 py-1 text-xs">
                  <span className="text-lg font-bold">{discount}</span>
                  <br />
                  <span className="text-xs">TK</span>
                  <br />
                  <span className="text-xs">Off</span>
                </Badge>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-off-white/90 hover:bg-off-white">
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Buy Now Overlay */}
            <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-soft-black/80 to-transparent p-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button
                variant="traditional"
                className="w-full text-off-white font-semibold"
                disabled={!inStock}
                onClick={handleBuyNow}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {!inStock ? 'Out of Stock' : 'Buy Now'}
              </Button>
            </div>

            {/* Stock Status */}
            {!inStock && (
              <div className="absolute inset-0 bg-soft-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg font-semibold px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Product Title */}
            <h3 className="font-semibold text-base line-clamp-2 hover:text-luxury-gold transition-colors cursor-pointer">
              {title}
            </h3>

            {/* Product Code */}
            <p className="text-sm text-charcoal-grey">
              Code: <span className="font-medium text-soft-black">{code}</span>
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-2">
              {originalPrice > salePrice ? (
                <>
                  <span className="text-sm text-charcoal-grey line-through">
                    Tk {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-luxury-gold">
                    Tk {salePrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-luxury-gold">
                  Tk {salePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Mobile Buy Button */}
            <div className="md:hidden mt-3">
              <Button
                variant="traditional"
                className="w-full text-off-white"
                disabled={!inStock}
                onClick={handleBuyNow}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {!inStock ? 'Out of Stock' : 'Buy Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;