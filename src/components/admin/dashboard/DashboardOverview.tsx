import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  DollarSign,
  Tag,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats, useRecentOrders, useTopProducts } from '@/hooks/useDashboard';

const DashboardOverview = () => {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { orders: recentOrders, loading: ordersLoading, error: ordersError } = useRecentOrders();
  const { products: topProducts, loading: productsLoading, error: productsError } = useTopProducts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'destructive';
      default: return 'outline';
    }
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <Loader2 className="h-4 w-4 animate-spin text-luxury-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-soft-black">--</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  Loading data...
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading dashboard data: {statsError}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-soft-black">{stats?.totalProducts || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats?.monthlyGrowth.products && stats.monthlyGrowth.products > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              {stats?.monthlyGrowth.products || 0}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-soft-black">{stats?.totalOrders || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats?.monthlyGrowth.orders && stats.monthlyGrowth.orders > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              {stats?.monthlyGrowth.orders || 0}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-soft-black">{stats?.totalCategories || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Active categories
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-soft-black">৳{stats?.totalRevenue?.toLocaleString() || '0'}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats?.monthlyGrowth.revenue && stats.monthlyGrowth.revenue > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              {stats?.monthlyGrowth.revenue || 0}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <div className="text-center text-red-600 py-4">
                Error loading orders: {ordersError}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No recent orders found
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-soft-black">{order.id}</p>
                      <p className="text-sm text-charcoal-grey">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-luxury-gold">৳{order.amount.toLocaleString()}</p>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top Selling Products
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : productsError ? (
              <div className="text-center text-red-600 py-4">
                Error loading products: {productsError}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No product data available
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-soft-black">{product.name}</p>
                      <p className="text-sm text-charcoal-grey">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-luxury-gold">৳{product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default DashboardOverview;