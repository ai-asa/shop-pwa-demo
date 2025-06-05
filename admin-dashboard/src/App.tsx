import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import Orders from '@/pages/Orders'
import Menu from '@/pages/Menu'
import Customers from '@/pages/Customers'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App