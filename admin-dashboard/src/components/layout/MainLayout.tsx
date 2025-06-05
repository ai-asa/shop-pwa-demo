import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Coffee, 
  Users, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
  { name: '注文管理', href: '/orders', icon: ShoppingCart },
  { name: 'メニュー管理', href: '/menu', icon: Coffee },
  { name: '顧客管理', href: '/customers', icon: Users },
  { name: '売上分析', href: '/analytics', icon: TrendingUp },
  { name: '設定', href: '/settings', icon: Settings },
]

export default function MainLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* モバイルサイドバーオーバーレイ */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/80 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* モバイルサイドバー */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">とあるカフェ 管理画面</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* デスクトップサイドバー */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-white shadow-lg">
          <div className="flex h-16 items-center px-6 border-b bg-gradient-to-r from-gray-800 to-gray-700">
            <h2 className="text-lg font-semibold text-white">とあるカフェ 管理画面</h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900 shadow-sm border-l-4 border-gray-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="lg:pl-64">
        {/* ヘッダー */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 shadow-sm lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">
              {navigation.find(item => item.href === location.pathname)?.name || 'ダッシュボード'}
            </h1>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
                <span className="text-sm font-medium text-gray-700">管理者</span>
              </div>
            </div>
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto p-4 lg:p-6 xl:max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}