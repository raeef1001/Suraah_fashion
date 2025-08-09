import { Search, Bell, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  activeTab: string;
  onAddNew: () => void;
}

const AdminHeader = ({ activeTab, onAddNew }: AdminHeaderProps) => {
  const getPageTitle = (tab: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      products: 'Product Management',
      categories: 'Category Management',
      orders: 'Order Management',
      customers: 'Customer Management',
      inventory: 'Inventory Management',
      shipping: 'Shipping Management',
      analytics: 'Analytics & Reports',
      settings: 'Settings'
    };
    return titles[tab] || 'Admin Panel';
  };

  const getPageDescription = (tab: string) => {
    const descriptions: { [key: string]: string } = {
      dashboard: 'Overview of your Suraah Fashion store',
      products: 'Manage your Panjabi collection and inventory',
      categories: 'Organize your product categories',
      orders: 'Track and manage customer orders',
      customers: 'Manage customer accounts and information',
      inventory: 'Monitor stock levels and inventory',
      shipping: 'Configure shipping options and rates',
      analytics: 'View sales reports and analytics',
      settings: 'Configure store settings and preferences'
    };
    return descriptions[tab] || 'Manage your store';
  };

  return (
    <header className="bg-off-white border-b border-charcoal-grey/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soft-black">
            {getPageTitle(activeTab)}
          </h1>
          <p className="text-charcoal-grey">{getPageDescription(activeTab)}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-grey" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64 border-charcoal-grey/30 focus:border-luxury-gold" 
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-burnt-orange">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">Order #1005 from রহিম উদ্দিন</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-muted-foreground">Premium Panjabi SKU-00474 has only 2 items left</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">Order #12345 for Luxury Embroidery Collection</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add New Button */}
          <Button variant="traditional" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/" className="w-full">View Website</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;