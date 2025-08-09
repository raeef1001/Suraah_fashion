import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings, 
  Store,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Users,
  Package,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SettingsManagementProps {
  triggerAddNew?: number;
}

const SettingsManagement = ({ triggerAddNew }: SettingsManagementProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Handle triggerAddNew from parent component
  useEffect(() => {
    if (triggerAddNew && triggerAddNew > 0) {
      // For settings, "Add New" could mean add new admin user
      console.log('Adding new admin user - this would open a user creation dialog');
    }
  }, [triggerAddNew]);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Suraah Fashion',
    storeDescription: 'Premium Bangladeshi Panjabi Collection - Traditional Elegance Redefined',
    storeEmail: 'info@suraahfashion.com',
    storePhone: '+880 1234-567890',
    storeAddress: 'Dhaka, Bangladesh',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    language: 'bn',
    taxRate: '15',
    shippingFee: '50'
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    promotionalEmails: false
  });

  // Security Settings State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5'
  });

  // Payment Settings State
  const [payments, setPayments] = useState({
    bkash: true,
    nagad: true,
    rocket: false,
    cashOnDelivery: true,
    bankTransfer: true,
    creditCard: false
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
    
    setLoading(false);
  };

  const handleStoreSettingChange = (field: string, value: string) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field: string, value: boolean) => {
    setPayments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-soft-black">Settings Management</h2>
          <p className="text-charcoal-grey">Configure your store settings and preferences</p>
        </div>
        <Badge variant="outline" className="text-luxury-gold border-luxury-gold">
          <Settings className="h-3 w-3 mr-1" />
          System Configuration
        </Badge>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-luxury-gold" />
                Store Information
              </CardTitle>
              <CardDescription>
                Basic information about your Suraah Fashion store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => handleStoreSettingChange('storeName', e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => handleStoreSettingChange('storeEmail', e.target.value)}
                    placeholder="Enter store email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => handleStoreSettingChange('storePhone', e.target.value)}
                    placeholder="Enter store phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={storeSettings.currency} onValueChange={(value) => handleStoreSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">BDT (৳)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={(e) => handleStoreSettingChange('storeDescription', e.target.value)}
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => handleStoreSettingChange('storeAddress', e.target.value)}
                  placeholder="Enter store address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={storeSettings.timezone} onValueChange={(value) => handleStoreSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) => handleStoreSettingChange('taxRate', e.target.value)}
                    placeholder="Enter tax rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Default Shipping Fee (৳)</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    value={storeSettings.shippingFee}
                    onChange={(e) => handleStoreSettingChange('shippingFee', e.target.value)}
                    placeholder="Enter shipping fee"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="traditional" 
                  onClick={() => handleSaveSettings('Store')}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Store Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-luxury-gold" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    checked={notifications.orderAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('orderAlerts', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
                  </div>
                  <Switch
                    checked={notifications.lowStockAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('lowStockAlerts', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promotional Emails</Label>
                    <p className="text-sm text-muted-foreground">Send promotional emails to customers</p>
                  </div>
                  <Switch
                    checked={notifications.promotionalEmails}
                    onCheckedChange={(checked) => handleNotificationChange('promotionalEmails', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="traditional" 
                  onClick={() => handleSaveSettings('Notification')}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-luxury-gold" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Manage security settings for your admin account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select value={security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Select value={security.passwordExpiry} onValueChange={(value) => handleSecurityChange('passwordExpiry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expiry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Select value={security.loginAttempts} onValueChange={(value) => handleSecurityChange('loginAttempts', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="traditional" 
                  onClick={() => handleSaveSettings('Security')}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-luxury-gold" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Configure available payment methods for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-soft-black">Mobile Banking</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>bKash</Label>
                      <p className="text-sm text-muted-foreground">Enable bKash payments</p>
                    </div>
                    <Switch
                      checked={payments.bkash}
                      onCheckedChange={(checked) => handlePaymentChange('bkash', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nagad</Label>
                      <p className="text-sm text-muted-foreground">Enable Nagad payments</p>
                    </div>
                    <Switch
                      checked={payments.nagad}
                      onCheckedChange={(checked) => handlePaymentChange('nagad', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rocket</Label>
                      <p className="text-sm text-muted-foreground">Enable Rocket payments</p>
                    </div>
                    <Switch
                      checked={payments.rocket}
                      onCheckedChange={(checked) => handlePaymentChange('rocket', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-soft-black">Traditional Methods</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground">Enable COD payments</p>
                    </div>
                    <Switch
                      checked={payments.cashOnDelivery}
                      onCheckedChange={(checked) => handlePaymentChange('cashOnDelivery', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bank Transfer</Label>
                      <p className="text-sm text-muted-foreground">Enable bank transfers</p>
                    </div>
                    <Switch
                      checked={payments.bankTransfer}
                      onCheckedChange={(checked) => handlePaymentChange('bankTransfer', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Credit Card</Label>
                      <p className="text-sm text-muted-foreground">Enable credit card payments</p>
                    </div>
                    <Switch
                      checked={payments.creditCard}
                      onCheckedChange={(checked) => handlePaymentChange('creditCard', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="traditional" 
                  onClick={() => handleSaveSettings('Payment')}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-luxury-gold" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Advanced system settings and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="h-5 w-5 text-luxury-gold" />
                    <h4 className="font-medium">Database</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Backup and optimize your database
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Optimize Tables
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="h-5 w-5 text-luxury-gold" />
                    <h4 className="font-medium">API Keys</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage third-party integrations
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Payment Gateway
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Service
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-luxury-gold" />
                    <h4 className="font-medium">User Management</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage admin users and permissions
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admin User
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Roles
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Palette className="h-5 w-5 text-luxury-gold" />
                    <h4 className="font-medium">Theme</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize the appearance
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Palette className="h-4 w-4 mr-2" />
                      Color Scheme
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;