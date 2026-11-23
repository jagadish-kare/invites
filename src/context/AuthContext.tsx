import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthState } from '../types/user'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (response.ok) {
            const user = await response.json()
            setState({ user, isAuthenticated: true, isLoading: false })
            return
          }
        } catch (error) {
          console.error('Auth check failed:', error)
        }
        localStorage.removeItem('authToken')
      }
      setState({ user: null, isAuthenticated: false, isLoading: false })
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token)
        setState({ user: data.user, isAuthenticated: true, isLoading: false })
        return { success: true }
      }
      return { success: false, error: data.error || 'Login failed' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token)
        setState({ user: data.user, isAuthenticated: true, isLoading: false })
        return { success: true }
      }
      return { success: false, error: data.error || 'Signup failed' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
