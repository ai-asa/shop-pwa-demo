import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading,
  Container,
  Badge
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Order } from '@shared/types'
import { mockApi } from '@shared/utils/mockApi'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await mockApi.getOrders()
    setOrders(data)
    setLoading(false)
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'preparing': return 'orange'
      case 'ready': return 'green'
      case 'completed': return 'gray'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '受付中'
      case 'preparing': return '調理中'
      case 'ready': return '受取可能'
      case 'completed': return '完了'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

  return (
    <Container maxW="container.md" p={4}>
      <VStack gap={4} align="stretch">
        <Heading size="lg">注文履歴</Heading>

        {loading ? (
          <Text>読み込み中...</Text>
        ) : orders.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">注文履歴がありません</Text>
          </Box>
        ) : (
          <VStack gap={3} align="stretch">
            {orders.map((order) => (
              <Box key={order.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
                <Box p={4}>
                  <VStack align="stretch" gap={3}>
                    <HStack justify="space-between">
                      <VStack align="start" gap={0}>
                        <Text fontWeight="bold">{order.id}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(order.createdAt).toLocaleString('ja-JP')}
                        </Text>
                      </VStack>
                      <Badge 
                        colorScheme={getStatusColor(order.status)}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {getStatusText(order.status)}
                      </Badge>
                    </HStack>

                    <VStack align="start" gap={1}>
                      {order.items.map((item, index) => (
                        <Text key={index} fontSize="sm">
                          {item.menuItem.name} x {item.quantity}
                        </Text>
                      ))}
                    </VStack>

                    <HStack justify="space-between">
                      <Badge variant="outline">
                        {order.type === 'dine-in' ? '店内' : 'テイクアウト'}
                      </Badge>
                      <Text fontWeight="bold" fontSize="lg">
                        ¥{order.totalAmount}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  )
}