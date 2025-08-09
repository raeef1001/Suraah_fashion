import { useState } from 'react';
import { Search, Phone, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import suraahLogo from '@/assets/suraah_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { categories: dbCategories, loading: categoriesLoading } = useCategories();

  // Filter active categories and sort by sortOrder, then add "ALL PRODUCT" at the beginning
  const activeCategories = dbCategories
    .filter(category => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  
  const categories = ['ALL PRODUCT', ...activeCategories.map(cat => cat.name.toUpperCase())];

  // Handle category click
  const handleCategoryClick = (category: string) => {
    if (category === 'ALL PRODUCT') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="sticky top-0 z-50 bg-deep-navy/95 backdrop-blur supports-[backdrop-filter]:bg-deep-navy/60 border-b border-charcoal-grey">
      {/* Top Bar */}
      <div className="bg-soft-black text-off-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>01708771510</span>
          </div>
          <div className="hidden md:block">
            <span className="font-bengali">পাঞ্জাবি এক্সক্লুসিভ - ঐতিহ্যবাহী পোশাকের নির্ভরযোগ্য ঠিকানা</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={suraahLogo} 
              alt="Suraah Fashion" 
              className="w-auto"
              style={{ height: '5rem' }}
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-grey h-4 w-4" />
              <Input
                placeholder="Search product..."
                className="pl-10 pr-4 py-2 w-full border-2 focus:border-luxury-gold"
              />
              <Button
                variant="traditional"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-grey h-4 w-4" />
            <Input
              placeholder="Search product..."
              className="pl-10 pr-16 py-2 w-full"
            />
            <Button
              variant="traditional"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              Go
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-deep-navy border-t border-charcoal-grey ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-1 py-2">
            {categoriesLoading ? (
              // Loading skeleton for categories
              <div className="flex flex-col md:flex-row md:space-x-1 animate-pulse">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-charcoal-grey/30 rounded mb-1 md:mb-0 w-32"
                  />
                ))}
              </div>
            ) : (
              categories.map((category, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleCategoryClick(category)}
                  className="justify-start md:justify-center text-sm font-medium py-3 px-4 text-off-white hover:bg-luxury-gold hover:text-soft-black transition-colors cursor-pointer"
                >
                  {category}
                </Button>
              ))
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;