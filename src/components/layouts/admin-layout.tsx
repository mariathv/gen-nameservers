import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../ui/admin-sidebar'
import { AdminTopbar } from '../ui/admin-topbar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <motion.main 
          className="flex-1 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}