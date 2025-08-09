import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-deep-navy text-off-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-off-white">SURAAH</span>
              <br />
              <span className="text-luxury-gold">FASHION</span>
            </div>
            <p className="text-off-white/80 font-bengali text-sm">
              ঐতিহ্যবাহী পাঞ্জাবির সর্ববৃহৎ সংগ্রহ। প্রিমিয়াম কোয়ালিটি এবং সাশ্রায়ী মূল্যে পেয়ে যান আপনার পছন্দের পোশাক।
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16DAUVgPjK/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-off-white hover:bg-off-white/20">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="text-off-white hover:bg-off-white/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-off-white hover:bg-off-white/20">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-off-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'All Products',
                'Luxury Panjabi',
                'Embroidery Panjabi',
                'Print Panjabi',
                'Solid Panjabi',
                'Combo Package',
                'Koti & Trouser'
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-off-white/80 hover:text-luxury-gold transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-off-white">Customer Service</h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Contact Us',
                'Privacy Policy',
                'Terms & Conditions',
                'Return & Refund',
                'Size Guide',
                'FAQ'
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-off-white/80 hover:text-luxury-gold transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-off-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-luxury-gold mt-0.5" />
                <div className="text-sm">
                  <p className="font-bengali text-off-white/90">
                    মিরপুর-১, কিয়াংসি চাইনিজ এর সামনে।
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-luxury-gold" />
                <span className="text-off-white/90">01708771510</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-luxury-gold" />
                <span className="text-off-white/90">info@suraahfashion.com</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 text-luxury-gold mt-0.5">📱</div>
                <div className="text-sm">
                  <p className="text-off-white/90 font-bengali">WhatsApp যোগাযোগ:</p>
                  <a href="https://wa.me/message/TDPIAWSDHFCHP1" target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors">
                    Message Suraah Fashion Galib
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-4 border-t border-off-white/20">
              <h4 className="text-sm font-semibold mb-2 text-off-white">Newsletter</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  className="bg-off-white/10 border-off-white/20 text-off-white placeholder:text-off-white/60"
                />
                <Button variant="traditional" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-off-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="text-sm text-off-white/80">
              © 2025 Suraah Fashion. All rights reserved.
            </div>
            <div className="text-sm text-off-white/60 font-bengali">
              www.suraahfashion.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;