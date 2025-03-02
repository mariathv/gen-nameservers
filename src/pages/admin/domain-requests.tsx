import { motion } from 'framer-motion'
import { Check, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/use-toast'
import { useDomainStore } from '../../lib/store'
import { formatDate, getStatusBgColor, getStatusColor } from '../../lib/utils'

export function DomainRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const { domainRequests, updateDomainRequest } = useDomainStore()
  const { toast } = useToast()
  
  // Mock data for domain requests
  const mockDomainRequests = [
    {
      id: "1",
      domain: "example.com",
      email: "user@example.com",
      status: "pending",
      created_at: "2023-11-10T10:30:00Z"
    },
    {
      id: "2",
      domain: "mydomain.org",
      email: "john@mydomain.org",
      status: "pending",
      created_at: "2023-11-09T14:20:00Z"
    },
    {
      id: "3",
      domain: "testsite.net",
      email: "admin@testsite.net",
      status: "approved",
      created_at: "2023-11-08T09:15:00Z"
    },
    {
      id: "4",
      domain: "newproject.io",
      email: "dev@newproject.io",
      status: "pending",
      created_at: "2023-11-07T16:45:00Z"
    },
    {
      id: "5",
      domain: "rejected-domain.com",
      email: "contact@rejected-domain.com",
      status: "rejected",
      created_at: "2023-11-06T11:10:00Z"
    }
  ]
  
  // Use mock data if store is empty
  const requests = domainRequests.length > 0 ? domainRequests : mockDomainRequests
  
  // Filter requests based on search query
  const filteredRequests = requests.filter(request => 
    request.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleApprove = (id: string) => {
    updateDomainRequest(id, "approved")
    toast({
      title: "Domain Approved",
      description: "The domain request has been approved successfully.",
    })
  }
  
  const handleReject = (id: string) => {
    updateDomainRequest(id, "rejected")
    toast({
      title: "Domain Rejected",
      description: "The domain request has been rejected.",
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Domain Requests</h2>
        <p className="text-muted-foreground">
          Manage incoming domain nameserver requests.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Review and approve domain nameserver requests.
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search domains..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No domain requests found.
                </div>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.domain}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBgColor(request.status)} ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.email} • Submitted {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-500 border-green-500/20 hover:bg-green-500/10 hover:text-green-500"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Revoke
                        </Button>
                      )}
                      {request.status === "rejected" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-500 border-green-500/20 hover:bg-green-500/10 hover:text-green-500"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}