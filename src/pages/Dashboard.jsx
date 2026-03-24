import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Users, CreditCard, Calendar, AlertTriangle, User, Clock, Dumbbell } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
    fetchActivity()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats/')
      setStats(response.data)
    } catch (error) {
      // Silently fail for stats
    }
  }

  const fetchActivity = async () => {
    try {
      const response = await api.get('/dashboard/activity/')
      setActivities(response.data)
    } catch (error) {
      // Silently fail for activity
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

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'user': return <User className="h-4 w-4" />
      case 'credit_card': return <CreditCard className="h-4 w-4" />
      case 'calendar': return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_member': return 'bg-blue-100 text-blue-800'
      case 'subscription': return 'bg-green-100 text-green-800'
      case 'booking': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
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
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)} bg-opacity-20`}>
                    <div className={getActivityColor(activity.type).replace('bg-', 'text-')}>
                      {getActivityIcon(activity.icon)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No recent activity
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/members')}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <User className="h-4 w-4 text-blue-600" />
              <span>Add New Member</span>
            </button>
            <button 
              onClick={() => navigate('/classes')}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <Dumbbell className="h-4 w-4 text-purple-600" />
              <span>Schedule Class</span>
            </button>
            <button 
              onClick={() => navigate('/memberships')}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <CreditCard className="h-4 w-4 text-green-600" />
              <span>Manage Subscriptions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
