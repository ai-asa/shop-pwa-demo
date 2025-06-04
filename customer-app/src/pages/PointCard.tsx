import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading,
  Container,
  Image
} from '@chakra-ui/react'

export default function PointCard() {
  return (
    <Container maxW="container.md" p={4}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">ポイントカード</Heading>

        {/* ポイントカード */}
        <Box 
          bgGradient="linear(to-br, orange.300, orange.500)"
          color="white"
          borderRadius="lg"
          overflow="hidden"
        >
          <Box p={4}>
            <VStack gap={4}>
              <HStack justify="space-between" w="full">
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" opacity={0.9}>会員ランク</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    ブロンズ
                  </Text>
                </VStack>
                <VStack align="end" gap={0}>
                  <Text fontSize="sm" opacity={0.9}>ポイント</Text>
                  <Text fontSize="3xl" fontWeight="bold">1250</Text>
                </VStack>
              </HStack>

              {/* QRコード */}
              <Box bg="white" p={4} borderRadius="md">
                <Image 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CAFE-USER-001" 
                  alt="ポイントカードQRコード"
                  boxSize="200px"
                />
              </Box>

              <Text fontSize="sm" textAlign="center" opacity={0.9}>
                レジでこのQRコードを提示してください
              </Text>
            </VStack>
          </Box>
        </Box>

        {/* 会員特典 */}
        <Box>
          <Heading size="md" mb={4}>会員特典</Heading>
          <VStack gap={3} align="stretch">
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Box p={4}>
                <Text fontWeight="bold" mb={1}>ドリンク10%OFF</Text>
                <Text fontSize="sm" color="gray.600">
                  全ドリンクメニューが10%割引
                </Text>
              </Box>
            </Box>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Box p={4}>
                <Text fontWeight="bold" mb={1}>誕生日特典</Text>
                <Text fontSize="sm" color="gray.600">
                  誕生月に特別クーポンプレゼント
                </Text>
              </Box>
            </Box>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Box p={4}>
                <Text fontWeight="bold" mb={1}>限定メニュー</Text>
                <Text fontSize="sm" color="gray.600">
                  会員限定メニューの注文が可能
                </Text>
              </Box>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}