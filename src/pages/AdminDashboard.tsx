import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import ProductManagement from '@/components/admin/products/ProductManagement';
import OrderManagement from '@/components/admin/orders/OrderManagement';
import CategoryManagement from '@/components/admin/categories/CategoryManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State to trigger add new functionality in child components
  const [triggerAddNew, setTriggerAddNew] = useState(0);

  const handleAddNew = () => {
    // Trigger add new functionality in child components
    setTriggerAddNew(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductManagement triggerAddNew={triggerAddNew} />;
      case 'orders':
        return <OrderManagement triggerAddNew={triggerAddNew} />;
      case 'categories':
        return <CategoryManagement triggerAddNew={triggerAddNew} />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-off-white">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
