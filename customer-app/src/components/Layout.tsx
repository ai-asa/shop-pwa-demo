import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Box, 
  Container, 
  HStack, 
  Text, 
  VStack,
  Badge
} from '@chakra-ui/react'
import { FiHome, FiCoffee, FiShoppingCart, FiClipboard, FiAward } from 'react-icons/fi'
import { useEffect, useState } from 'react'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
}

const navItems: NavItem[] = [
  { icon: FiHome, label: 'ホーム', path: '/' },
  { icon: FiCoffee, label: 'メニュー', path: '/menu' },
  { icon: FiShoppingCart, label: 'カート', path: '/cart' },
  { icon: FiClipboard, label: '注文', path: '/orders' },
  { icon: FiAward, label: 'ポイント', path: '/points' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  // カート内のアイテム数を取得（Mock実装）
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cafe_cart')
      if (cart) {
        const items = JSON.parse(cart)
        const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(count)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    return () => window.removeEventListener('storage', updateCartCount)
  }, [])

  return (
    <Box minH="100vh" pb="80px">
      <Container maxW="container.md" p={0}>
        <Outlet />
      </Container>

      {/* ボトムナビゲーション */}
      <HStack
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        h="70px"
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        px={4}
        justifyContent="space-around"
        boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <VStack
              key={item.path}
              as="button"
              onClick={() => navigate(item.path)}
              position="relative"
              flex={1}
              h="full"
              justifyContent="center"
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              transition="all 0.2s"
            >
              <Box position="relative">
                <Icon 
                  size={24} 
                  color={isActive ? 'orange.500' : 'gray.500'}
                />
                {item.path === '/cart' && cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    borderRadius="full"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Box>
              <Text 
                fontSize="xs" 
                color={isActive ? 'orange.500' : 'gray.500'}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {item.label}
              </Text>
            </VStack>
          )
        })}
      </HStack>
    </Box>
  )
}