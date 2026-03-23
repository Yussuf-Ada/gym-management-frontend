import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Search, Edit, Trash2, CreditCard, Calendar, AlertTriangle } from 'lucide-react'

function Memberships() {
  const [memberships, setMemberships] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('plans')
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '',
    is_active: true
  })

  const [subscriptionForm, setSubscriptionForm] = useState({
    member: '',
    membership: '',
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [plansRes, subsRes] = await Promise.all([
        api.get('/memberships/'),
        api.get('/memberships/subscriptions/')
      ])
      setMemberships(plansRes.data.results || plansRes.data)
      setSubscriptions(subsRes.data.results || subsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPlan) {
        await api.patch(`/memberships/${editingPlan.id}/`, planForm)
      } else {
        await api.post('/memberships/', planForm)
      }
      fetchData()
      resetPlanForm()
    } catch (error) {
      console.error('Failed to save membership plan:', error)
    }
  }

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/memberships/subscriptions/', subscriptionForm)
      fetchData()
      resetSubscriptionForm()
    } catch (error) {
      console.error('Failed to create subscription:', error)
    }
  }

  const handleDeletePlan = async (id) => {
    if (confirm('Are you sure you want to delete this membership plan?')) {
      try {
        await api.delete(`/memberships/${id}/`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete plan:', error)
      }
    }
  }

  const handleDeleteSubscription = async (id) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await api.delete(`/memberships/subscriptions/${id}/`)
        fetchData()
      } catch (error) {
        console.error('Failed to cancel subscription:', error)
      }
    }
  }

  const resetPlanForm = () => {
    setPlanForm({
      name: '',
      description: '',
      price: '',
      duration_days: '',
      is_active: true
    })
    setEditingPlan(null)
    setShowPlanForm(false)
  }

  const resetSubscriptionForm = () => {
    setSubscriptionForm({
      member: '',
      membership: '',
      start_date: '',
      end_date: ''
    })
    setShowSubscriptionForm(false)
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const isExpiringSoon = (endDate) => {
    const daysUntilExpiry = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Memberships</h1>
        <button
          onClick={() => activeTab === 'plans' ? setShowPlanForm(true) : setShowSubscriptionForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          {activeTab === 'plans' ? 'Add Plan' : 'Add Subscription'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="h-4 w-4 inline mr-2" />
            Membership Plans
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subscriptions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Subscriptions
          </button>
        </nav>
      </div>

      {/* Membership Plans Tab */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberships.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{plan.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.duration_days} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingPlan(plan)
                        setPlanForm({
                          name: plan.name,
                          description: plan.description,
                          price: plan.price,
                          duration_days: plan.duration_days,
                          is_active: plan.is_active
                        })
                        setShowPlanForm(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {memberships.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No membership plans found
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.member?.first_name} {sub.member?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.membership?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isExpired(sub.end_date) ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    ) : isExpiringSoon(sub.end_date) ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteSubscription(sub.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscriptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No subscriptions found
            </div>
          )}
        </div>
      )}

      {/* Plan Form Modal */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlan ? 'Edit Membership Plan' : 'Add Membership Plan'}
            </h2>
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={planForm.name}
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm({...planForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    required
                    value={planForm.duration_days}
                    onChange={(e) => setPlanForm({...planForm, duration_days: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={planForm.is_active}
                  onChange={(e) => setPlanForm({...planForm, is_active: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetPlanForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Form Modal */}
      {showSubscriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Subscription</h2>
            <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                <select
                  required
                  value={subscriptionForm.member}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, member: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Member</option>
                  {/* This would need to fetch members list */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Plan</label>
                <select
                  required
                  value={subscriptionForm.membership}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, membership: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Plan</option>
                  {memberships.filter(m => m.is_active).map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - £{plan.price} ({plan.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={subscriptionForm.start_date}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={subscriptionForm.end_date}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={resetSubscriptionForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Memberships
