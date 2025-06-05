import { useState } from 'react'
import { ChevronDown, Store, Users, Settings as SettingsIcon, CreditCard, Save, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StoreInfo {
  name: string
  address: string
  phone: string
  businessHours: { [key: string]: { open: string; close: string } }
  holidays: string[]
  announcement: string
}

interface Staff {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
  lastLogin: string
}

interface SystemSettings {
  notifications: {
    newOrder: boolean
    orderSound: boolean
    soundVolume: number
    inventoryAlert: boolean
  }
  syncInterval: '30s' | '1m' | '5m'
  display: {
    language: 'ja' | 'en'
    timezone: string
    dateFormat: string
  }
}

interface PointSettings {
  pointRate: number
  tiers: {
    bronze: { threshold: number; benefits: string }
    silver: { threshold: number; benefits: string }
    gold: { threshold: number; benefits: string }
  }
  expirationDays: number
  minimumUnit: number
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState<string>('store')
  const [hasChanges, setHasChanges] = useState(false)

  // 店舗情報
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: 'カフェPWAデモ店',
    address: '東京都渋谷区道玄坂1-2-3',
    phone: '03-1234-5678',
    businessHours: {
      月: { open: '08:00', close: '20:00' },
      火: { open: '08:00', close: '20:00' },
      水: { open: '08:00', close: '20:00' },
      木: { open: '08:00', close: '20:00' },
      金: { open: '08:00', close: '22:00' },
      土: { open: '09:00', close: '22:00' },
      日: { open: '09:00', close: '20:00' }
    },
    holidays: [],
    announcement: ''
  })

  // スタッフ管理
  const [staff, setStaff] = useState<Staff[]>([
    { id: '1', name: '管理者太郎', email: 'admin@example.com', role: 'admin', lastLogin: '2024-01-15 10:30' },
    { id: '2', name: 'スタッフ花子', email: 'staff1@example.com', role: 'staff', lastLogin: '2024-01-15 09:00' },
    { id: '3', name: 'スタッフ次郎', email: 'staff2@example.com', role: 'staff', lastLogin: '2024-01-14 18:30' }
  ])

  // システム設定
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    notifications: {
      newOrder: true,
      orderSound: true,
      soundVolume: 70,
      inventoryAlert: true
    },
    syncInterval: '1m',
    display: {
      language: 'ja',
      timezone: 'Asia/Tokyo',
      dateFormat: 'yyyy/MM/dd'
    }
  })

  // ポイント設定
  const [pointSettings, setPointSettings] = useState<PointSettings>({
    pointRate: 5,
    tiers: {
      bronze: { threshold: 0, benefits: '基本ポイント付与' },
      silver: { threshold: 500, benefits: 'ポイント1.2倍' },
      gold: { threshold: 1000, benefits: 'ポイント1.5倍' }
    },
    expirationDays: 365,
    minimumUnit: 1
  })

  const handleSave = () => {
    // モック実装
    alert('設定を保存しました')
    setHasChanges(false)
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">設定</h2>
          <p className="text-gray-500">店舗運営に必要な各種設定を管理します</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            変更を保存
          </Button>
        )}
      </div>

      {/* 店舗情報設定 */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('store')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>店舗情報</CardTitle>
                <CardDescription>基本情報・営業時間・定休日</CardDescription>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                activeSection === 'store' ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {activeSection === 'store' && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">店舗名</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={storeInfo.name}
                  onChange={(e) => {
                    setStoreInfo({ ...storeInfo, name: e.target.value })
                    setHasChanges(true)
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">電話番号</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={storeInfo.phone}
                  onChange={(e) => {
                    setStoreInfo({ ...storeInfo, phone: e.target.value })
                    setHasChanges(true)
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">住所</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={storeInfo.address}
                onChange={(e) => {
                  setStoreInfo({ ...storeInfo, address: e.target.value })
                  setHasChanges(true)
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">営業時間</label>
              <div className="space-y-2">
                {Object.entries(storeInfo.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-12 text-sm">{day}曜</span>
                    <input
                      type="time"
                      className="px-2 py-1 border rounded"
                      value={hours.open}
                      onChange={(e) => {
                        setStoreInfo({
                          ...storeInfo,
                          businessHours: {
                            ...storeInfo.businessHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        })
                        setHasChanges(true)
                      }}
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      className="px-2 py-1 border rounded"
                      value={hours.close}
                      onChange={(e) => {
                        setStoreInfo({
                          ...storeInfo,
                          businessHours: {
                            ...storeInfo.businessHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">お知らせメッセージ</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="顧客アプリに表示するお知らせを入力..."
                value={storeInfo.announcement}
                onChange={(e) => {
                  setStoreInfo({ ...storeInfo, announcement: e.target.value })
                  setHasChanges(true)
                }}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* スタッフ管理 */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('staff')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>スタッフ管理</CardTitle>
                <CardDescription>アクセス権限とログイン履歴</CardDescription>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                activeSection === 'staff' ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {activeSection === 'staff' && (
          <CardContent>
            <div className="mb-4 flex justify-end">
              <Button onClick={() => {
                // モック実装：新規スタッフ追加
                const newStaff: Staff = {
                  id: Date.now().toString(),
                  name: '新規スタッフ',
                  email: 'new@example.com',
                  role: 'staff',
                  lastLogin: new Date().toLocaleString()
                }
                setStaff([...staff, newStaff])
                setHasChanges(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                スタッフを追加
              </Button>
            </div>
            <div className="space-y-2">
              {staff.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role === 'admin' ? '管理者' : 'スタッフ'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        最終ログイン: {member.lastLogin}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setStaff(staff.filter(s => s.id !== member.id))
                      setHasChanges(true)
                    }}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* システム設定 */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('system')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>システム設定</CardTitle>
                <CardDescription>通知・同期・表示設定</CardDescription>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                activeSection === 'system' ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {activeSection === 'system' && (
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">通知設定</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">新規注文通知</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.newOrder}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        notifications: {
                          ...systemSettings.notifications,
                          newOrder: e.target.checked
                        }
                      })
                      setHasChanges(true)
                    }}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">通知音</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.orderSound}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        notifications: {
                          ...systemSettings.notifications,
                          orderSound: e.target.checked
                        }
                      })
                      setHasChanges(true)
                    }}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">在庫アラート</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.inventoryAlert}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        notifications: {
                          ...systemSettings.notifications,
                          inventoryAlert: e.target.checked
                        }
                      })
                      setHasChanges(true)
                    }}
                    className="rounded"
                  />
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">データ同期</h4>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={systemSettings.syncInterval}
                onChange={(e) => {
                  setSystemSettings({
                    ...systemSettings,
                    syncInterval: e.target.value as '30s' | '1m' | '5m'
                  })
                  setHasChanges(true)
                }}
              >
                <option value="30s">30秒</option>
                <option value="1m">1分</option>
                <option value="5m">5分</option>
              </select>
            </div>
            <div>
              <h4 className="font-medium mb-3">表示設定</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">言語</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={systemSettings.display.language}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        display: {
                          ...systemSettings.display,
                          language: e.target.value as 'ja' | 'en'
                        }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ポイントカード設定 */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('points')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>ポイントカード設定</CardTitle>
                <CardDescription>ポイント付与率・ランク設定</CardDescription>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                activeSection === 'points' ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {activeSection === 'points' && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ポイント付与率（購入金額に対する％）
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pointSettings.pointRate}
                onChange={(e) => {
                  setPointSettings({
                    ...pointSettings,
                    pointRate: parseInt(e.target.value) || 0
                  })
                  setHasChanges(true)
                }}
              />
            </div>
            <div>
              <h4 className="font-medium mb-3">会員ランク設定</h4>
              <div className="space-y-3">
                {Object.entries(pointSettings.tiers).map(([tier, settings]) => (
                  <div key={tier} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={tier === 'gold' ? 'warning' : tier === 'silver' ? 'secondary' : 'default'}>
                        {tier === 'gold' ? 'ゴールド' : tier === 'silver' ? 'シルバー' : 'ブロンズ'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {settings.threshold}ポイント以上
                      </span>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      value={settings.benefits}
                      onChange={(e) => {
                        setPointSettings({
                          ...pointSettings,
                          tiers: {
                            ...pointSettings.tiers,
                            [tier]: { ...settings, benefits: e.target.value }
                          }
                        })
                        setHasChanges(true)
                      }}
                      placeholder="特典内容"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ポイント有効期限（日数）
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pointSettings.expirationDays}
                onChange={(e) => {
                  setPointSettings({
                    ...pointSettings,
                    expirationDays: parseInt(e.target.value) || 0
                  })
                  setHasChanges(true)
                }}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}