import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { useToast } from '../../components/ui/use-toast'
import { useTheme } from '../../components/theme-provider'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  
  const [apiSettings, setApiSettings] = useState({
    apiKey: "••••••••••••••••",
    email: "admin@example.com",
    accountId: "••••••••••••••••"
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    domainApproved: true,
    domainRejected: true,
    systemAlerts: true
  })
  
  const handleApiSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your API settings have been updated successfully.",
    })
  }
  
  const handleNotificationSettingsSave = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      
      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes.
                  </p>
                </div>
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure your Cloudflare API credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiSettings.apiKey}
                  onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={apiSettings.email}
                  onChange={(e) => setApiSettings({ ...apiSettings, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountId">Account ID</Label>
                <Input
                  id="accountId"
                  value={apiSettings.accountId}
                  onChange={(e) => setApiSettings({ ...apiSettings, accountId: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleApiSettingsSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email.
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="domainApproved">Domain Approved</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a domain is approved.
                  </p>
                </div>
                <Switch
                  id="domainApproved"
                  checked={notificationSettings.domainApproved}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, domainApproved: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="domainRejected">Domain Rejected</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a domain is rejected.
                  </p>
                </div>
                <Switch
                  id="domainRejected"
                  checked={notificationSettings.domainRejected}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, domainRejected: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about system issues and updates.
                  </p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, systemAlerts: checked })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationSettingsSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}