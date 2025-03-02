import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Nameserver Generator. All rights reserved.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link 
            to="/terms" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </motion.div>
      </div>
    </footer>
  )
}