import { useEffect, useState } from 'react'
import { Search, User as UserIcon, Award, Calendar, Plus, Gift } from 'lucide-react'
import type { User, Order } from '@shared/types'
import { adminMockApi } from '@/utils/adminMockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CustomerWithLastVisit extends User {
  lastVisit: Date | null
}

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerWithLastVisit[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithLastVisit | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPointsDialog, setShowPointsDialog] = useState(false)
  const [pointsAmount, setPointsAmount] = useState('')
  const [pointsReason, setPointsReason] = useState('manual')

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerDetails(selectedCustomer.id)
    }
  }, [selectedCustomer])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await adminMockApi.getCustomers()
      setCustomers(data)
      if (data.length > 0 && !selectedCustomer) {
        setSelectedCustomer(data[0])
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomerDetails = async (userId: string) => {
    try {
      const orders = await adminMockApi.getCustomerOrders(userId)
      setCustomerOrders(orders)
    } catch (error) {
      console.error('Failed to load customer details:', error)
    }
  }

  const handleAddPoints = async () => {
    if (!selectedCustomer || !pointsAmount) return

    try {
      await adminMockApi.addPoints(
        selectedCustomer.id,
        parseInt(pointsAmount),
        pointsReason
      )
      setShowPointsDialog(false)
      setPointsAmount('')
      setPointsReason('manual')
      // リロードして更新
      await loadCustomers()
    } catch (error) {
      console.error('Failed to add points:', error)
    }
  }

  const getTierColor = (points: number) => {
    if (points >= 1000) return 'warning'
    if (points >= 500) return 'secondary'
    return 'default'
  }

  const getTierName = (points: number) => {
    if (points >= 1000) return 'ゴールド'
    if (points >= 500) return 'シルバー'
    return 'ブロンズ'
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64">読み込み中...</div>
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 顧客リスト */}
      <div className="xl:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>顧客一覧</CardTitle>
            <CardDescription>ポイントカード会員の管理</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 検索バー */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前またはメールで検索..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 顧客リスト */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getTierColor(customer.points)}>
                        {getTierName(customer.points)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{customer.points}pt</p>
                    </div>
                  </div>
                  {customer.lastVisit && (
                    <p className="text-xs text-gray-400 mt-2">
                      最終来店: {new Date(customer.lastVisit).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 顧客詳細 */}
      <div className="xl:col-span-2">
        {selectedCustomer ? (
          <div className="space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedCustomer.name}</CardTitle>
                    <CardDescription>{selectedCustomer.email}</CardDescription>
                  </div>
                  <Badge variant={getTierColor(selectedCustomer.points)} className="text-lg px-4 py-2">
                    {getTierName(selectedCustomer.points)}会員
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-600">保有ポイント</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.points}pt</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <p className="text-sm font-medium text-gray-600">会員ランク</p>
                    </div>
                    <p className="text-xl font-bold text-purple-600">{getTierName(selectedCustomer.points)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-gray-600">最終来店</p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {selectedCustomer.lastVisit
                        ? new Date(selectedCustomer.lastVisit).toLocaleDateString()
                        : 'なし'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ポイント操作 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ポイント管理</CardTitle>
                  <Button onClick={() => setShowPointsDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    ポイント付与
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showPointsDialog ? (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <label className="block text-sm font-medium mb-2">付与ポイント数</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(e.target.value)}
                        placeholder="例: 100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">付与理由</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                      >
                        <option value="manual">手動付与</option>
                        <option value="campaign">キャンペーン</option>
                        <option value="birthday">誕生日特典</option>
                        <option value="apology">お詫び</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddPoints} disabled={!pointsAmount}>
                        付与する
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPointsDialog(false)
                          setPointsAmount('')
                          setPointsReason('manual')
                        }}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    ポイント履歴やポイント付与機能がここに表示されます
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 注文履歴 */}
            <Card>
              <CardHeader>
                <CardTitle>注文履歴</CardTitle>
                <CardDescription>直近10件の注文</CardDescription>
              </CardHeader>
              <CardContent>
                {customerOrders.length > 0 ? (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">注文 #{order.id.slice(-6)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">¥{order.totalAmount.toLocaleString()}</p>
                            <Badge
                              variant={
                                order.status === 'completed' ? 'success' :
                                order.status === 'cancelled' ? 'destructive' :
                                'default'
                              }
                            >
                              {order.status === 'pending' && '受付中'}
                              {order.status === 'preparing' && '調理中'}
                              {order.status === 'ready' && '受取可能'}
                              {order.status === 'completed' && '完了'}
                              {order.status === 'cancelled' && 'キャンセル'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.menuItem.name} ×{item.quantity}
                              {index < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">注文履歴がありません</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-gray-500">顧客を選択してください</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}