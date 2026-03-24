import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Search, Edit, Trash2, Calendar, Clock, Users, MapPin } from 'lucide-react'

function Classes() {
  const [classes, setClasses] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('classes')
  const [showClassForm, setShowClassForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)

  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    instructor: '',
    schedule: '',
    duration_minutes: '',
    capacity: '',
    is_active: true
  })

  const [bookingForm, setBookingForm] = useState({
    gym_class: '',
    member: '',
    booking_date: ''
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [classesRes, bookingsRes] = await Promise.all([
        api.get('/classes/'),
        api.get('/classes/bookings/')
      ])
      setClasses(classesRes.data.results || classesRes.data)
      setBookings(bookingsRes.data.results || bookingsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClassSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClass) {
        await api.patch(`/classes/${editingClass.id}/`, classForm)
      } else {
        await api.post('/classes/', classForm)
      }
      fetchData()
      resetClassForm()
    } catch (error) {
      console.error('Failed to save class:', error)
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/classes/bookings/', bookingForm)
      fetchData()
      resetBookingForm()
    } catch (error) {
      console.error('Failed to create booking:', error)
    }
  }

  const handleDeleteClass = async (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${id}/`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const handleDeleteBooking = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/classes/bookings/${id}/`)
        fetchData()
      } catch (error) {
        console.error('Failed to cancel booking:', error)
      }
    }
  }

  const resetClassForm = () => {
    setClassForm({
      name: '',
      description: '',
      instructor: '',
      schedule: '',
      duration_minutes: '',
      capacity: '',
      is_active: true
    })
    setEditingClass(null)
    setShowClassForm(false)
  }

  const resetBookingForm = () => {
    setBookingForm({
      gym_class: '',
      member: '',
      booking_date: ''
    })
    setShowBookingForm(false)
  }

  const getBookingCount = (classId) => {
    return bookings.filter(b => b.gym_class === classId && b.status === 'confirmed').length
  }

  const isClassFull = (gymClass) => {
    const count = getBookingCount(gymClass.id)
    return count >= gymClass.capacity
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
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <button
          onClick={() => activeTab === 'classes' ? setShowClassForm(true) : setShowBookingForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          {activeTab === 'classes' ? 'Add Class' : 'Add Booking'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'classes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Classes
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Bookings
          </button>
        </nav>
      </div>

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((gymClass) => {
                const bookingCount = getBookingCount(gymClass.id)
                const full = isClassFull(gymClass)
                
                return (
                  <tr key={gymClass.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{gymClass.name}</div>
                        <div className="text-sm text-gray-500">{gymClass.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gymClass.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(gymClass.schedule).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(gymClass.schedule).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gymClass.duration_minutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className={full ? 'text-red-600 font-medium' : ''}>
                          {bookingCount}/{gymClass.capacity}
                        </span>
                        {full && <span className="text-xs text-red-600">(Full)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        gymClass.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {gymClass.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingClass(gymClass)
                          setClassForm({
                            name: gymClass.name,
                            description: gymClass.description,
                            instructor: gymClass.instructor,
                            schedule: gymClass.schedule,
                            duration_minutes: gymClass.duration_minutes,
                            capacity: gymClass.capacity,
                            is_active: gymClass.is_active
                          })
                          setShowClassForm(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(gymClass.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {classes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No classes found
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.member?.first_name} {booking.member?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.gym_class?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.gym_class?.schedule).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      )}

      {/* Class Form Modal */}
      {showClassForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleClassSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={classForm.description}
                  onChange={(e) => setClassForm({...classForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={classForm.instructor}
                  onChange={(e) => setClassForm({...classForm, instructor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="datetime-local"
                  required
                  value={classForm.schedule}
                  onChange={(e) => setClassForm({...classForm, schedule: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    value={classForm.duration_minutes}
                    onChange={(e) => setClassForm({...classForm, duration_minutes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({...classForm, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={classForm.is_active}
                  onChange={(e) => setClassForm({...classForm, is_active: e.target.checked})}
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
                  {editingClass ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetClassForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Booking</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  required
                  value={bookingForm.gym_class}
                  onChange={(e) => setBookingForm({...bookingForm, gym_class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Class</option>
                  {classes.filter(c => c.is_active && !isClassFull(c)).map(gymClass => (
                    <option key={gymClass.id} value={gymClass.id}>
                      {gymClass.name} - {new Date(gymClass.schedule).toLocaleDateString()} ({getBookingCount(gymClass.id)}/{gymClass.capacity} spots)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                <select
                  required
                  value={bookingForm.member}
                  onChange={(e) => setBookingForm({...bookingForm, member: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Member</option>
                  {/* This would need to fetch members list */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                <input
                  type="date"
                  required
                  value={bookingForm.booking_date}
                  onChange={(e) => setBookingForm({...bookingForm, booking_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Book
                </button>
                <button
                  type="button"
                  onClick={resetBookingForm}
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

export default Classes
