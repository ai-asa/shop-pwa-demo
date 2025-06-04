import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  VStack, 
  Text, 
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Image,
  HStack,
  Icon
} from '@chakra-ui/react'
import { FiSmartphone, FiShare, FiPlus } from 'react-icons/fi'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOSInstall, setShowIOSInstall] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // PWAインストールプロンプトをキャッチ
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      onOpen() // 自動的にモーダルを表示
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS検出
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone
    
    if (isIOS && !isInStandaloneMode) {
      setShowIOSInstall(true)
      onOpen()
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [onOpen])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      onClose()
    }
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={6}>
          <VStack gap={4}>
            <Box 
              bg="orange.500" 
              p={3} 
              borderRadius="full"
              color="white"
            >
              <FiSmartphone size={32} />
            </Box>
            
            <Heading size="md" textAlign="center">
              アプリをインストール
            </Heading>
            
            <Text textAlign="center" color="gray.600" fontSize="sm">
              ホーム画面に追加して、アプリのように使えます
            </Text>

            {/* Android/Desktop Chrome */}
            {deferredPrompt && !isIOS && (
              <Button 
                colorScheme="orange" 
                size="lg" 
                w="full"
                onClick={handleInstall}
                leftIcon={<FiPlus />}
              >
                ホーム画面に追加
              </Button>
            )}

            {/* iOS Safari */}
            {showIOSInstall && isIOS && (
              <VStack gap={3} w="full">
                <Text fontSize="sm" fontWeight="bold">
                  インストール方法：
                </Text>
                <VStack align="start" gap={2} w="full" bg="gray.50" p={4} borderRadius="md">
                  <HStack>
                    <Icon as={FiShare} color="blue.500" />
                    <Text fontSize="sm">Safari下部の共有ボタンをタップ</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" ml={6}>↓</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiPlus} color="gray.600" />
                    <Text fontSize="sm">「ホーム画面に追加」を選択</Text>
                  </HStack>
                </VStack>
              </VStack>
            )}

            <Button variant="ghost" size="sm" onClick={onClose}>
              後で
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}