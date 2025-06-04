import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Button,
  Container,
  Image
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem } from '@shared/types'

export default function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const cart = localStorage.getItem('cafe_cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
    }
  }

  const removeItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    setCartItems(newCart)
    localStorage.setItem('cafe_cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('storage'))
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  }

  if (cartItems.length === 0) {
    return (
      <Container maxW="container.md" p={4}>
        <VStack gap={6} py={10}>
          <Heading size="lg">カート</Heading>
          <Text color="gray.500">カートは空です</Text>
          <Button colorScheme="orange" onClick={() => navigate('/menu')}>
            メニューを見る
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" p={4}>
      <VStack gap={4} align="stretch">
        <Heading size="lg">カート</Heading>

        <VStack gap={3} align="stretch">
          {cartItems.map((item, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Box p={4}>
                <HStack gap={4}>
                  <Image
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    boxSize="60px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <VStack align="start" flex={1} gap={0}>
                    <Text fontWeight="bold">{item.menuItem.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      数量: {item.quantity}
                    </Text>
                    <Text fontWeight="bold" color="orange.500">
                      ¥{item.menuItem.price * item.quantity}
                    </Text>
                  </VStack>
                  <Button
                    aria-label="削除"
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem(index)}
                  >
                    <FiTrash2 />
                  </Button>
                </HStack>
              </Box>
            </Box>
          ))}
        </VStack>

        <Box borderTop="1px" borderColor="gray.200" pt={4}>
          <HStack justify="space-between" fontSize="xl" fontWeight="bold">
            <Text>合計</Text>
            <Text color="orange.500">¥{calculateTotal()}</Text>
          </HStack>
        </Box>

        <Button colorScheme="orange" size="lg">
          注文する
        </Button>
      </VStack>
    </Container>
  )
}