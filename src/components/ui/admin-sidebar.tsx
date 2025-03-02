import { motion } from 'framer-motion'
import { BarChart3, Globe, LogOut, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../lib/store'
import { cn } from '../../lib/utils'
import { Button } from './button'

export function AdminSidebar() {
  const { logout } = useAuthStore()
  
  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Domain Requests', href: '/admin/requests' },
    { icon: Globe, label: 'Nameservers', href: '/admin/nameservers' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]
  
  return (
    <motion.aside 
      className="hidden md:flex h-screen w-64 flex-col border-r bg-card"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">NS</span>
          </div>
          <span>Nameserver Admin</span>
        </NavLink>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </motion.aside>
  )
}