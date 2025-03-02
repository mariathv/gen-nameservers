import { motion } from 'framer-motion'
import { Copy, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/use-toast'
import { useDomainStore } from '../../lib/store'
import { formatDate } from '../../lib/utils'

export function Nameservers() {
  const [searchQuery, setSearchQuery] = useState('')
  const { domains, removeDomain } = useDomainStore()
  const { toast } = useToast()
  
  // Mock data for nameservers
  const mockDomains = [
    {
      id: "1",
      domain: "example.com",
      nameservers: ["ns1.cloudflare.com", "ns2.cloudflare.com", "ns3.cloudflare.com", "ns4.cloudflare.com"],
      created_at: "2023-11-10T10:30:00Z"
    },
    {
      id: "2",
      domain: "mydomain.org",
      nameservers: ["ns1.cloudflare.com", "ns2.cloudflare.com"],
      created_at: "2023-11-09T14:20:00Z"
    },
    {
      id: "3",
      domain: "testsite.net",
      nameservers: ["ns1.cloudflare.com", "ns2.cloudflare.com", "ns3.cloudflare.com", "ns4.cloudflare.com"],
      created_at: "2023-11-08T09:15:00Z"
    },
    {
      id: "4",
      domain: "newproject.io",
      nameservers: ["ns1.cloudflare.com", "ns2.cloudflare.com", "ns3.cloudflare.com", "ns4.cloudflare.com"],
      created_at: "2023-11-07T16:45:00Z"
    }
  ]
  
  // Use mock data if store is empty
  const allDomains = domains.length > 0 ? domains : mockDomains
  
  // Filter domains based on search query
  const filteredDomains = allDomains.filter(domain => 
    domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleCopyNameservers = (nameservers: string[]) => {
    navigator.clipboard.writeText(nameservers.join('\n'))
    toast({
      title: "Copied to clipboard",
      description: "Nameservers have been copied to your clipboard.",
    })
  }
  
  const handleDeleteDomain = (id: string, domain: string) => {
    removeDomain(id)
    toast({
      title: "Domain Deleted",
      description: `${domain} has been deleted successfully.`,
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Nameservers</h2>
        <p className="text-muted-foreground">
          Manage active domain nameservers.
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
                <CardTitle>Active Domains</CardTitle>
                <CardDescription>
                  View and manage domains with active nameservers.
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
              {filteredDomains.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No domains found.
                </div>
              ) : (
                filteredDomains.map((domain, index) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-card">
                      <div>
                        <h3 className="font-medium">{domain.domain}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created on {formatDate(domain.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-primary"
                          onClick={() => handleCopyNameservers(domain.nameservers)}
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => handleDeleteDomain(domain.id, domain.domain)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 border-t">
                      <div className="text-sm font-medium mb-2">Nameservers:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {domain.nameservers.map((ns, i) => (
                          <div 
                            key={i} 
                            className="bg-background p-2 rounded border text-sm font-mono"
                          >
                            {ns}
                          </div>
                        ))}
                      </div>
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