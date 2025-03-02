import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  fullName: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface Domain {
  id: string
  domain: string
  nameservers: string[]
  created_at: string
}

interface DomainRequest {
  id: string
  domain: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface DomainState {
  domains: Domain[]
  domainRequests: DomainRequest[]
  setDomains: (domains: Domain[]) => void
  setDomainRequests: (requests: DomainRequest[]) => void
  addDomain: (domain: Domain) => void
  removeDomain: (id: string) => void
  updateDomainRequest: (id: string, status: 'approved' | 'rejected') => void
}

export const useDomainStore = create<DomainState>()((set) => ({
  domains: [],
  domainRequests: [],
  setDomains: (domains) => set({ domains }),
  setDomainRequests: (domainRequests) => set({ domainRequests }),
  addDomain: (domain) => set((state) => ({ domains: [...state.domains, domain] })),
  removeDomain: (id) => set((state) => ({ 
    domains: state.domains.filter((d) => d.id !== id) 
  })),
  updateDomainRequest: (id, status) => set((state) => ({
    domainRequests: state.domainRequests.map((req) => 
      req.id === id ? { ...req, status } : req
    )
  })),
}))

interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)