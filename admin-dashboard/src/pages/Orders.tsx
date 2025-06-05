import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminMockApi } from '@/utils/adminMockApi'
import type { AdminOrder } from '@/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Clock, Coffee, Package, CheckCircle, XCircle, ChevronRight } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  useEffect(() => {
    loadOrders()
    // 10秒ごとに注文を更新
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await adminMockApi.getAdminOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      const updatedOrder = await adminMockApi.updateOrderStatus(orderId, newStatus)
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const getStatusIcon = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return Clock
      case 'preparing': return Coffee
      case 'ready': return Package
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const getStatusColor = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'preparing': return 'warning'
      case 'ready': return 'success'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusText = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return '受付中'
      case 'preparing': return '調理中'
      case 'ready': return '受取可能'
      case 'completed': return '完了'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

  const getNextStatus = (currentStatus: AdminOrder['status']): AdminOrder['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing'
      case 'preparing': return 'ready'
      case 'ready': return 'completed'
      default: return null
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  if (loading) {
    return <div className="flex items-center justify-center h-64">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('all')}
        >
          すべて ({orders.length})
        </Button>
        <Button
          variant={selectedStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('pending')}
        >
          受付中 ({orders.filter(o => o.status === 'pending').length})
        </Button>
        <Button
          variant={selectedStatus === 'preparing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('preparing')}
        >
          調理中 ({orders.filter(o => o.status === 'preparing').length})
        </Button>
        <Button
          variant={selectedStatus === 'ready' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('ready')}
        >
          受取可能 ({orders.filter(o => o.status === 'ready').length})
        </Button>
        <Button
          variant={selectedStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('completed')}
        >
          完了 ({orders.filter(o => o.status === 'completed').length})
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 注文リスト */}
        <div className="xl:col-span-2 space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const nextStatus = getNextStatus(order.status)
            
            return (
              <Card 
                key={order.id} 
                className={`cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">{order.id}</h3>
                        <Badge variant={getStatusColor(order.status) as any}>
                          {getStatusText(order.status)}
                        </Badge>
                        <Badge variant="outline">
                          {order.type === 'dine-in' ? '店内' : 'テイクアウト'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">顧客名</p>
                          <p className="font-medium">{order.customerInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">注文時刻</p>
                          <p className="font-medium">
                            {format(new Date(order.createdAt), 'HH:mm', { locale: ja })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">商品数</p>
                          <p className="font-medium">{order.items.length}点</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">合計金額</p>
                          <p className="font-medium">¥{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, nextStatus)
                          }}
                        >
                          {getStatusText(nextStatus)}へ
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, 'cancelled')
                          }}
                        >
                          キャンセル
                        </Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 注文詳細 */}
        {selectedOrder && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>注文詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">注文ID</p>
                <p className="font-medium">{selectedOrder.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">顧客情報</p>
                <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                {selectedOrder.customerInfo.phone && (
                  <p className="text-sm">{selectedOrder.customerInfo.phone}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">注文内容</p>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.menuItem.name} x {item.quantity}</span>
                      <span>¥{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>合計</span>
                    <span>¥{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">注文メモ</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">ステータス履歴</p>
                <div className="space-y-2 mt-2">
                  {selectedOrder.statusHistory.map((history, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <Badge variant={getStatusColor(history.status) as any}>
                        {getStatusText(history.status)}
                      </Badge>
                      <span className="text-muted-foreground">
                        {format(new Date(history.timestamp), 'HH:mm', { locale: ja })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}