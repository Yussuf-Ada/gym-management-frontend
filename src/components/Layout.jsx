import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  LogOut,
  Dumbbell
} from 'lucide-react'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/memberships', icon: CreditCard, label: 'Memberships' },
    { to: '/classes', icon: Calendar, label: 'Classes' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-indigo-600">
          <Dumbbell className="h-8 w-8" />
          <span className="text-xl font-bold">GymManager</span>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 hover:bg-indigo-600 transition-colors ${
                  isActive ? 'bg-indigo-800 border-r-4 border-white' : ''
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
          <div className="text-sm text-indigo-200 mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
