import { 
  Box, 
  VStack, 
  Text, 
  Heading, 
  Container,
  SimpleGrid,
  Image,
  HStack,
  Badge,
  Button,
  Icon
} from '@chakra-ui/react'
import { FiCoffee, FiPackage, FiGift, FiShoppingBag } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { mockApi } from '@shared/utils/mockApi'
import { MenuItem } from '@shared/types'

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    setLoading(true)
    const { data } = await mockApi.getMenuItems()
    setMenuItems(data)
    setLoading(false)
  }

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      menuItem: item,
      quantity: 1,
      customizations: {}
    }

    const existingCart = localStorage.getItem('cafe_cart')
    const cart = existingCart ? JSON.parse(existingCart) : []
    cart.push(cartItem)
    localStorage.setItem('cafe_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
  }

  // カテゴリー別にアイテムをグループ化
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryOrder = ['ドリンク', 'フード', 'デザート', 'グッズ'];
  
  const categoryIcons = {
    'ドリンク': FiCoffee,
    'フード': FiPackage,
    'デザート': FiGift,
    'グッズ': FiShoppingBag
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">メニュー</Heading>

        {loading ? (
          <Text>読み込み中...</Text>
        ) : (
          <VStack gap={8} align="stretch">
            {categoryOrder.map((category) => (
              groupedItems[category] && groupedItems[category].length > 0 && (
                <Box key={category}>
                  <HStack mb={4} gap={2}>
                    <Box color="orange.500">
                      <Icon as={categoryIcons[category as keyof typeof categoryIcons]} />
                    </Box>
                    <Heading size="md" color="gray.700">
                      {category}
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={2} gap={3}>
                    {groupedItems[category].map((item) => (
              <Box 
                key={item.id} 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden" 
                bg="white"
                h="290px"
                display="flex"
                flexDirection="column"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  h="100px"
                  w="full"
                  objectFit="cover"
                />
                <Box p={3} flex={1} display="flex" flexDirection="column">
                  <VStack align="start" gap={1} flex={1}>
                    <Heading size="xs">{item.name}</Heading>
                    <Text fontWeight="bold" color="orange.500" fontSize="sm">
                      ¥{item.price}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {item.description}
                    </Text>
                    {item.isPopular && (
                      <Badge colorScheme="orange" fontSize="xs">人気</Badge>
                    )}
                  </VStack>
                  <Button
                    size="xs"
                    colorScheme="orange"
                    w="full"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    mt={2}
                  >
                    {item.inStock ? 'カートに追加' : '売り切れ'}
                  </Button>
                </Box>
              </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  )
}