import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import UserNavbar from './UserNavbar' // Import the user navbar component
import AdminNavbar from './AdminNavbar' // Import the admin navbar component
import Footer from './Footer'
import { UserRole } from '../../types/core'

export default function Layout() {
  const { user } = useAuth()
  
  const renderNavbar = () => {
    if (user?.role === UserRole.Admin) {
      return <AdminNavbar  />
    }
    return <UserNavbar  />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50  ">
      {renderNavbar()}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  )
}