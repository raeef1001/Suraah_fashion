import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Sample analytics data
  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '৳2,45,678',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      description: 'vs last month'
    },
    {
      title: 'New Customers',
      value: '456',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      description: 'vs last month'
    },
    {
      title: 'Products Sold',
      value: '2,890',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      description: 'vs last month'
    }
  ];

  const topProducts = [
    { name: 'Premium Punjabi Set', sales: 156, revenue: '৳78,000', growth: '+23%' },
    { name: 'Traditional Kurta', sales: 134, revenue: '৳67,000', growth: '+18%' },
    { name: 'Embroidered Shirt', sales: 98, revenue: '৳49,000', growth: '+12%' },
    { name: 'Casual Punjabi', sales: 87, revenue: '৳43,500', growth: '+8%' },
    { name: 'Festive Collection', sales: 76, revenue: '৳38,000', growth: '+15%' }
  ];

  const salesData = [
    { month: 'Jan', sales: 45000, orders: 234 },
    { month: 'Feb', sales: 52000, orders: 267 },
    { month: 'Mar', sales: 48000, orders: 245 },
    { month: 'Apr', sales: 61000, orders: 312 },
    { month: 'May', sales: 55000, orders: 289 },
    { month: 'Jun', sales: 67000, orders: 345 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-navy">Analytics Dashboard</h1>
          <p className="text-charcoal-grey mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-deep-navy hover:bg-deep-navy/90">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="border-charcoal-grey/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal-grey">{stat.title}</p>
                  <p className="text-2xl font-bold text-deep-navy mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-charcoal-grey ml-1">{stat.description}</span>
                  </div>
                </div>
                <div className="p-3 bg-luxury-gold/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-luxury-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
        </TabsList>

        {/* Sales Analytics */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Monthly Sales Trend</CardTitle>
                <CardDescription>Revenue and order trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-off-white rounded-lg">
                      <div>
                        <p className="font-medium text-deep-navy">{data.month}</p>
                        <p className="text-sm text-charcoal-grey">{data.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-deep-navy">৳{data.sales.toLocaleString()}</p>
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Growth
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Sales by Category</CardTitle>
                <CardDescription>Revenue breakdown by product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Punjabi Sets', percentage: 45, revenue: '৳1,10,250' },
                    { category: 'Kurtas', percentage: 30, revenue: '৳73,500' },
                    { category: 'Shirts', percentage: 15, revenue: '৳36,750' },
                    { category: 'Accessories', percentage: 10, revenue: '৳24,500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-deep-navy">{item.category}</span>
                        <span className="text-sm text-charcoal-grey">{item.revenue}</span>
                      </div>
                      <div className="w-full bg-off-white rounded-full h-2">
                        <div 
                          className="bg-luxury-gold h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-charcoal-grey">{item.percentage}% of total sales</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Performance */}
        <TabsContent value="products" className="space-y-6">
          <Card className="border-charcoal-grey/20">
            <CardHeader>
              <CardTitle className="text-deep-navy">Top Performing Products</CardTitle>
              <CardDescription>Best selling products in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-off-white rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-luxury-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-navy">{product.name}</p>
                        <p className="text-sm text-charcoal-grey">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-deep-navy">{product.revenue}</p>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Insights */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Customer Demographics</CardTitle>
                <CardDescription>Customer base analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Age 18-25', count: 234, percentage: 35 },
                    { label: 'Age 26-35', count: 312, percentage: 47 },
                    { label: 'Age 36-45', count: 89, percentage: 13 },
                    { label: 'Age 45+', count: 33, percentage: 5 }
                  ].map((demo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-deep-navy">{demo.label}</span>
                        <span className="text-sm text-charcoal-grey">{demo.count} customers</span>
                      </div>
                      <div className="w-full bg-off-white rounded-full h-2">
                        <div 
                          className="bg-luxury-gold h-2 rounded-full" 
                          style={{ width: `${demo.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Customer Retention</CardTitle>
                <CardDescription>Repeat customer analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-deep-navy">73%</div>
                    <div className="text-sm text-charcoal-grey">Customer Retention Rate</div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'New Customers', value: '27%', color: 'bg-blue-500' },
                      { label: 'Returning Customers', value: '73%', color: 'bg-luxury-gold' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-deep-navy">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-charcoal-grey">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Website Traffic */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Page Views</CardTitle>
                <CardDescription>Total page views this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-deep-navy">45,678</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12.5% vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Unique Visitors</CardTitle>
                <CardDescription>Unique visitors this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-deep-navy">12,345</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+8.3% vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-charcoal-grey/20">
              <CardHeader>
                <CardTitle className="text-deep-navy">Bounce Rate</CardTitle>
                <CardDescription>Average bounce rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-deep-navy">34.2%</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">-2.1% vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsManagement;