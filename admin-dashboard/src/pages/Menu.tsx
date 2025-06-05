import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminMockApi } from '@/utils/adminMockApi'
import { mockApi } from '@shared/utils/mockApi'
import type { MenuItem } from '@shared/types'
import { Coffee, Package, Gift, ShoppingBag, ToggleLeft, ToggleRight } from 'lucide-react'

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      const { data } = await mockApi.getMenuItems()
      setMenuItems(data)
    } catch (error) {
      console.error('Failed to load menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleInventoryStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const updatedItem = await adminMockApi.updateInventoryStatus(itemId, !currentStatus)
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? updatedItem : item
        )
      )
    } catch (error) {
      console.error('Failed to update inventory status:', error)
    }
  }

  const getCategoryIcon = (category: MenuItem['category']) => {
    switch (category) {
      case 'ドリンク': return Coffee
      case 'フード': return Package
      case 'デザート': return Gift
      case 'グッズ': return ShoppingBag
      default: return Coffee
    }
  }

  const categories = ['all', 'ドリンク', 'フード', 'デザート', 'グッズ'] as const
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  if (loading) {
    return <div className="flex items-center justify-center h-64">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* カテゴリータブ */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'すべて' : category}
            {' '}
            ({category === 'all' 
              ? menuItems.length 
              : menuItems.filter(item => item.category === category).length})
          </Button>
        ))}
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category)
          
          return (
            <Card key={item.id} className={!item.inStock ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  {item.isPopular && (
                    <Badge variant="default" className="text-xs">
                      人気
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge variant="success" className="text-xs">
                      新商品
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-40 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">売り切れ</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ¥{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">アレルギー情報</p>
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen) => (
                        <Badge key={allergen} variant="secondary" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">在庫状態</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleInventoryStatus(item.id, item.inStock)}
                      className="h-8"
                    >
                      {item.inStock ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-green-600">販売中</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-500">売り切れ</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}