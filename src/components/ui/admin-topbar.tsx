import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { useAuthStore } from '../../lib/store'
import { useTheme } from '../theme-provider'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { Input } from './input'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { AdminSidebar } from './admin-sidebar'

export function AdminTopbar() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <AdminSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search domains..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}