import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Layout from './components/Layout'
import InstallPrompt from './components/InstallPrompt'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import PointCard from './pages/PointCard'
import Profile from './pages/Profile'

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="points" element={<PointCard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Box>
  )
}

export default App