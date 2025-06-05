import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Package, Users, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { adminMockApi } from '@/utils/adminMockApi'
import type { SalesData } from '@/types'
import type { MenuItem } from '@shared/types'

type TimeRange = 'day' | 'week' | 'month'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topItems, setTopItems] = useState<{ item: MenuItem; soldCount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [showPreviousPeriod, setShowPreviousPeriod] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const endDate = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case 'day':
          startDate.setDate(endDate.getDate() - 7)
          break
        case 'week':
          startDate.setDate(endDate.getDate() - 28)
          break
        case 'month':
          startDate.setMonth(endDate.getMonth() - 6)
          break
      }

      const [sales, items] = await Promise.all([
        adminMockApi.getSalesData({ from: startDate, to: endDate }),
        adminMockApi.getTopSellingItems(10)
      ])

      setSalesData(sales)
      setTopItems(items)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    // モック実装
    alert('データのエクスポート機能は実装予定です')
  }

  // チャート用のデータ整形
  const chartData = salesData.map(data => ({
    date: new Date(data.date).toLocaleDateString('ja-JP', { 
      month: 'short', 
      day: 'numeric' 
    }),
    売上: data.totalAmount,
    注文数: data.orderCount,
    平均単価: data.orderCount > 0 ? Math.round(data.totalAmount / data.orderCount) : 0
  }))

  // カテゴリ別売上データ
  const categoryData = (() => {
    const categories: { [key: string]: number } = {}
    salesData.forEach(data => {
      data.itemsSold.forEach(item => {
        const menuItem = topItems.find(t => t.item.id === item.itemId)
        if (menuItem) {
          const category = menuItem.item.category
          categories[category] = (categories[category] || 0) + item.revenue
        }
      })
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  })()

  // 時間帯別データ（モック）
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 100) + 20
  }))

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

  if (loading) {
    return <div className="flex items-center justify-center h-64">読み込み中...</div>
  }

  const totalSales = salesData.reduce((sum, data) => sum + data.totalAmount, 0)
  const totalOrders = salesData.reduce((sum, data) => sum + data.orderCount, 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">売上分析</h2>
          <p className="text-gray-500">売上データの可視化と分析</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1 rounded ${timeRange === 'day' ? 'bg-white shadow' : ''}`}
              onClick={() => setTimeRange('day')}
            >
              日次
            </button>
            <button
              className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-white shadow' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              週次
            </button>
            <button
              className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-white shadow' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              月次
            </button>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総売上</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">期間合計</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">注文数</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">期間合計</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均単価</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">期間平均</p>
          </CardContent>
        </Card>
      </div>

      {/* 売上推移グラフ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>売上推移</CardTitle>
              <CardDescription>期間内の売上と注文数の推移</CardDescription>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPreviousPeriod}
                onChange={(e) => setShowPreviousPeriod(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">前期間比較</span>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="売上"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="注文数"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* カテゴリ別売上 */}
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別売上</CardTitle>
            <CardDescription>商品カテゴリ別の売上構成</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 人気商品TOP10 */}
        <Card>
          <CardHeader>
            <CardTitle>人気商品TOP10</CardTitle>
            <CardDescription>期間内の売上個数ランキング</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topItems.map(item => ({
                  name: item.item.name.length > 10 ? item.item.name.slice(0, 10) + '...' : item.item.name,
                  売上数: item.soldCount
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="売上数" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 時間帯別分析 */}
      <Card>
        <CardHeader>
          <CardTitle>時間帯別売上分析</CardTitle>
          <CardDescription>24時間の売上分布（ヒートマップ）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-24 gap-1">
            {hourlyData.map((data, index) => {
              const intensity = data.value / 120
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-16 rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                    }}
                    title={`${data.hour}時: ${data.value}件`}
                  />
                  <p className="text-xs mt-1">{data.hour}</p>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded" />
              <span className="text-sm">低</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded" />
              <span className="text-sm">中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span className="text-sm">高</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}