import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/use-toast'
import { domainsApi } from '../lib/api'

export function SubmitDomain() {
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domain || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // await domainsApi.submitDomain(domain, email)
      await domainsApi.submitDomain(domain)
      setIsSuccess(true)
      toast({
        title: "Success!",
        description: "Your domain has been submitted successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to submit domain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container max-w-md py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isSuccess ? (
          <SuccessMessage domain={domain} />
        ) : (
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Submit Your Domain</CardTitle>
              <CardDescription>
                Enter your domain name to generate Cloudflare nameservers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Domain"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              We'll process your request and notify you via email.
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function SuccessMessage({ domain }: { domain: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-500">Success!</CardTitle>
          <CardDescription>
            Your domain has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg font-medium">{domain}</p>
          <p className="text-center text-muted-foreground">
            We'll process your request and send you the nameservers via email.
            This usually takes just a few minutes.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <a href="/">Return to Home</a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}