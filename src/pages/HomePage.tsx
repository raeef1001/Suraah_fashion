import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;