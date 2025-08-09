import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  BarChart3,
  LogOut,
  Store,
  Tag,
  Truck,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import suraahLogo from '@/assets/suraah_logo.png';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="w-64 bg-deep-navy text-off-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-charcoal-grey/30">
        <div className="flex items-center justify-center">
          <img 
            src={suraahLogo} 
            alt="Suraah Fashion" 
            className="h-10 w-auto"
          />
        </div>
        <p className="text-xs text-off-white/60 mt-2 text-center font-bengali">অ্যাডমিন ড্যাশবোর্ড</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-luxury-gold/20 text-luxury-gold border-r-2 border-luxury-gold'
                : 'text-off-white/80 hover:text-off-white hover:bg-off-white/10'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-charcoal-grey/30">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-off-white border-off-white/30 hover:bg-off-white/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;