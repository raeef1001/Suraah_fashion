import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('admin_token');
    const adminExpiry = localStorage.getItem('admin_expiry');
    
    if (adminToken && adminExpiry) {
      const expiryTime = parseInt(adminExpiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Token expired, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_expiry');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo credentials - in production, this would be a secure API call
    if (username === 'admin' && password === 'punjabi123') {
      const token = 'admin_' + Date.now();
      const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_expiry', expiry.toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_expiry');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};