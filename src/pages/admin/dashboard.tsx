import { motion } from 'framer-motion'
import { Activity, ArrowUpRight, Globe, Server, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { getStatusBgColor, getStatusColor } from '../../lib/utils'

export function AdminDashboard() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Domains",
      value: "24",
      icon: Globe,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Pending Requests",
      value: "7",
      icon: Users,
      change: "+3",
      changeType: "neutral"
    },
    {
      title: "Active Nameservers",
      value: "18",
      icon: Server,
      change: "+5",
      changeType: "positive"
    },
    {
      title: "System Status",
      value: "Healthy",
      icon: Activity,
      change: "100% uptime",
      changeType: "positive"
    }
  ]
  
  const recentActivity = [
    {
      domain: "example.com",
      action: "Nameservers Generated",
      timestamp: "2 minutes ago",
      status: "success"
    },
    {
      domain: "mydomain.org",
      action: "Domain Submitted",
      timestamp: "15 minutes ago",
      status: "pending"
    },
    {
      domain: "testsite.net",
      action: "Nameservers Generated",
      timestamp: "1 hour ago",
      status: "success"
    },
    {
      domain: "faileddomain.com",
      action: "Generation Failed",
      timestamp: "3 hours ago",
      status: "failed"
    },
    {
      domain: "newdomain.io",
      action: "Domain Submitted",
      timestamp: "5 hours ago",
      status: "pending"
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your nameserver generation service.
        </p>
      </div>
      
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-500' : 
                  stat.changeType === 'negative' ? 'text-red-500' : 
                  'text-muted-foreground'
                } flex items-center`}>
                  {stat.change}
                  {stat.changeType === 'positive' && (
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest domain and nameserver activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.domain}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${getStatusBgColor(activity.status)} ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}