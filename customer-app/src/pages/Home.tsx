import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Button, 
  Image,
  SimpleGrid,
  Badge,
  Container,
  Flex
} from '@chakra-ui/react'
import { FiCoffee, FiGift, FiClock, FiMapPin } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const quickActions = [
    { icon: FiCoffee, label: 'メニューを見る', action: () => navigate('/menu'), color: 'orange' },
    { icon: FiGift, label: 'ポイントカード', action: () => navigate('/points'), color: 'purple' },
    { icon: FiClock, label: '注文履歴', action: () => navigate('/orders'), color: 'blue' },
    { icon: FiMapPin, label: '店舗情報', action: () => {}, color: 'green' },
  ]

  return (
    <Box>
      {/* ヘッダー */}
      <Box bg="orange.500" color="white" py={2} mb={3}>
        <Container maxW="container.md">
          <HStack gap={3}>
            <Box 
              bg="white" 
              p={1.5} 
              borderRadius="full"
              w="32px"
              h="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiCoffee size={20} color="#ED8936" />
            </Box>
            <VStack align="start" gap={0} flex={1}>
              <Heading size="sm">とあるカフェ</Heading>
              <Text fontSize="xs" opacity={0.9}>Toaru Cafe</Text>
            </VStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.md" p={4}>
        <VStack gap={4} align="stretch">
          {/* 統合ユーザー情報カード */}
          <Box 
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            p={3}
            boxShadow="sm"
          >
            <VStack gap={2}>
              <HStack w="full" justify="space-between">
                <Text fontSize="sm" fontWeight="medium">こんにちは、ゲストさん</Text>
                <Badge colorScheme="orange" fontSize="xs" px={2}>
                  ブロンズ
                </Badge>
              </HStack>
              <HStack w="full" justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500">保有ポイント</Text>
                <HStack align="baseline" gap={1}>
                  <Text fontSize="xl" fontWeight="bold" color="orange.500">1,250</Text>
                  <Text fontSize="xs" color="gray.500">pt</Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>

        {/* おすすめメニュー */}
        <Box>
          <Heading size="sm" mb={3}>本日のおすすめ</Heading>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
            <Image 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600" 
              alt="本日のおすすめ"
              h="150px"
              objectFit="cover"
            />
            <Box p={4}>
              <VStack align="start" gap={2}>
                <HStack>
                  <Badge colorScheme="red" fontSize="xs">期間限定</Badge>
                  <Badge colorScheme="green" fontSize="xs">新商品</Badge>
                </HStack>
                <Heading size="sm">季節のスペシャルラテ</Heading>
                <Text color="gray.600" fontSize="sm">
                  旬のフルーツを使った期間限定のスペシャルラテ。
                  今だけの特別な味わいをお楽しみください。
                </Text>
                <Button 
                  colorScheme="orange" 
                  size="sm"
                  w="full" 
                  onClick={() => navigate('/menu')}
                >
                  メニューを見る
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>

        {/* クイックアクション */}
        <Box>
          <Heading size="sm" mb={3}>クイックアクション</Heading>
          <SimpleGrid columns={2} gap={3}>
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Box 
                  key={index}
                  cursor="pointer"
                  onClick={action.action}
                  p={3}
                  bg="white"
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <VStack gap={2}>
                    <Flex
                      w="40px"
                      h="40px"
                      bg={`${action.color}.100`}
                      borderRadius="full"
                      align="center"
                      justify="center"
                    >
                      <Icon size="20" />
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium">{action.label}</Text>
                  </VStack>
                </Box>
              )
            })}
          </SimpleGrid>
        </Box>

        </VStack>
      </Container>
    </Box>
  )
}