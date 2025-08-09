import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import banner1 from '@/assets/banner-1.webp';
import banner2 from '@/assets/banner-2.webp';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      image: banner1,
      title: "ঐতিহ্যবাহী পাঞ্জাবির বিশাল সংগ্রহ",
      subtitle: "সারাদেশে হোম ডেলিভারি সেবা"
    },
    {
      image: banner2,
      title: "প্রিমিয়াম কোয়ালিটির পাঞ্জাবি",
      subtitle: "বিশেষ ছাড়ে পেয়ে যান"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Banner */}
      <div className="relative h-[500px] lg:h-[600px] bg-gradient-hero pattern-overlay">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {banners.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover filter brightness-80 contrast-120"
              />
              <div className="absolute inset-0 bg-deep-navy/20" />
            </div>
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-off-white max-w-4xl mx-auto px-4">
            {/* Arabic Text */}
            <div className="font-bengali text-lg mb-4 opacity-90">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            
            {/* Main Logo/Title */}
            <div className="mb-6">
              <h1 className="text-5xl lg:text-7xl font-bold mb-2 animate-slide-up">
                <span className="text-off-white">Suraah <span className="text-luxury-gold">Fashion</span></span>
              </h1>
            </div>

            {/* Bengali Description */}
            <div className="font-bengali text-lg lg:text-xl mb-4 opacity-90 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p>ঐতিহ্যবাহী পাঞ্জাবির বিশাল সংগ্রহ</p>
              <p>সারাদেশে হোম ডেলিভারি সেবা</p>
              <p>প্রিমিয়াম কোয়ালিটির পাঞ্জাবি বিশেষ ছাড়ে পেয়ে যান</p>
            </div>

            {/* Address */}
            <div className="font-bengali text-sm opacity-80 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
             নতুন পাঞ্জাবি কালেকশন সেরা দামে সেরা গুণগত মান
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <Button variant="hero" size="lg" className="text-lg px-8 py-4 bg-luxury-gold text-white hover:bg-burnt-orange">
                এখানেই কেনাকাটা করুন
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-deep-navy/10 border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-off-white">
                সংগ্রহ দেখুন
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-deep-navy/20 hover:bg-deep-navy/30 text-off-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-deep-navy/20 hover:bg-deep-navy/30 text-off-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-burnt-orange scale-125' : 'bg-off-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-off-white">
          <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-off-white">
          <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;