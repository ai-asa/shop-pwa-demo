import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminMockApi } from '@/utils/adminMockApi'
import type { DashboardStats, InventoryAlert, AdminOrder } from '@/types'
import type { MenuItem } from '@shared/types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([])
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([])
  const [topItems, setTopItems] = useState<{ item: MenuItem; soldCount: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    // 30秒ごとにデータを更新
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, alerts, orders, items] = await Promise.all([
        adminMockApi.getDashboardStats(),
        adminMockApi.getInventoryAlerts(),
        adminMockApi.getAdminOrders(),
        adminMockApi.getTopSellingItems()
      ])

      setStats(statsData)
      setInventoryAlerts(alerts)
      // 最新5件の注文を表示
      setRecentOrders(orders.slice(0, 5))
      setTopItems(items)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }


  const getOrderStats = () => {
    const pending = recentOrders.filter(o => o.status === 'pending').length
    const preparing = recentOrders.filter(o => o.status === 'preparing').length
    const ready = recentOrders.filter(o => o.status === 'ready').length
    return { pending, preparing, ready }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">読み込み中...</div>
  }

  const orderStats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">本日の売上</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats?.todaySales.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats?.previousDayComparison.sales && stats.previousDayComparison.sales > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.previousDayComparison.sales.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats?.previousDayComparison.sales.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">前日比</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">注文数</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayOrders || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats?.previousDayComparison.orders && stats.previousDayComparison.orders > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.previousDayComparison.orders.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats?.previousDayComparison.orders.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">前日比</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均単価</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{Math.round(stats?.averageOrderValue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              本日の平均注文金額
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">在庫アラート</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              要確認商品
            </p>
          </CardContent>
        </Card>
      </div>

      {/* リアルタイム注文状況 */}
      <Card>
        <CardHeader>
          <CardTitle>リアルタイム注文状況</CardTitle>
          <CardDescription>現在処理中の注文</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">受付中</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">調理中</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.preparing}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">受取可能</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.ready}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* 在庫アラート */}
        <Card>
          <CardHeader>
            <CardTitle>在庫アラート</CardTitle>
            <CardDescription>在庫切れ・少ない商品</CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">現在アラートはありません</p>
            ) : (
              <div className="space-y-2">
                {inventoryAlerts.map((alert) => (
                  <div key={alert.itemId} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-medium">{alert.itemName}</span>
                    <Badge variant={alert.alertType === 'out-of-stock' ? 'destructive' : 'warning'}>
                      {alert.alertType === 'out-of-stock' ? '在庫切れ' : `残り${alert.currentStock}個`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 人気商品TOP5 */}
        <Card>
          <CardHeader>
            <CardTitle>本日の人気商品</CardTitle>
            <CardDescription>売上個数ランキング TOP5</CardDescription>
          </CardHeader>
          <CardContent>
            {topItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">まだデータがありません</p>
            ) : (
              <div className="space-y-2">
                {topItems.map((item, index) => (
                  <div key={item.item.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{item.item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.item.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{item.soldCount}個</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}