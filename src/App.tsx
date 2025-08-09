import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { DirectOrderProvider } from "@/contexts/DirectOrderContext";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderConfirmPage from "./pages/OrderConfirmPage";
import CheckoutPage from '@/pages/CheckoutPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DirectOrderProvider>
      <AdminAuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="bg-off-white text-soft-black min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirm" element={<OrderConfirmPage />} />
              <Route path="/order-confirm/:orderId" element={<OrderConfirmPage />} />
              
              {/* Hidden Admin Routes - Only accessible via direct URL */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              
              {/* Legacy admin route redirect */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </DirectOrderProvider>
  </QueryClientProvider>
);

export default App;
