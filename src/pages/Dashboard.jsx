import { useState, useEffect } from 'react'
import api from '../services/api'
import { Users, CreditCard, Calendar, AlertTriangle } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats/')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Members', value: stats?.total_members || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Subscriptions', value: stats?.active_subscriptions || 0, icon: CreditCard, color: 'bg-green-500' },
    { label: 'Expiring Soon', value: stats?.expiring_soon || 0, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: "Today's Bookings", value: stats?.todays_bookings || 0, icon: Calendar, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-sm">
            Activity feed coming soon...
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              Add New Member
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              Schedule Class
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
