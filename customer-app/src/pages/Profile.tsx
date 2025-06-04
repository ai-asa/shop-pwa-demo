import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading,
  Container,
  Button
} from '@chakra-ui/react'

export default function Profile() {
  return (
    <Container maxW="container.md" p={4}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">プロフィール</Heading>

        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Box p={4}>
            <VStack gap={4} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" fontSize="xl">ゲストユーザー</Text>
                  <Text color="gray.500">guest@example.com</Text>
                </VStack>
              </HStack>

              <Box borderTop="1px" borderColor="gray.200" pt={4}>
                <VStack gap={3} align="stretch">
                  <HStack justify="space-between">
                    <Text>名前</Text>
                    <Text fontWeight="medium">ゲストユーザー</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>メールアドレス</Text>
                    <Text fontWeight="medium">guest@example.com</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>ポイント</Text>
                    <Text fontWeight="medium">1250</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Button colorScheme="red" variant="outline">
          ログアウト
        </Button>

        <Box textAlign="center" pt={4}>
          <Text fontSize="sm" color="gray.500">
            とあるカフェ v1.0.0
          </Text>
          <Text fontSize="xs" color="gray.400">
            © 2024 Toaru Cafe. All rights reserved.
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}