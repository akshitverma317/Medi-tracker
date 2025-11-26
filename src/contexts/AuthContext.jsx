import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedAuth = localStorage.getItem('medicine-tracker-auth')
        if (savedAuth) {
          const authData = JSON.parse(savedAuth)
          const now = new Date().getTime()
          
          // Check if session is still valid (24 hours)
          if (authData.expiresAt > now) {
            setIsAuthenticated(true)
            setUser(authData.user)
          } else {
            // Session expired, clear it
            localStorage.removeItem('medicine-tracker-auth')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('medicine-tracker-auth')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (credentials) => {
    const { username, password } = credentials
    
    // Simple validation - in production, this would be server-side
    const validCredentials = [
      { 
        username: 'admin', 
        password: 'admin123', 
        name: 'Administrator',
        role: 'admin',
        permissions: {
          canViewAll: true,
          canEditPatients: true,
          canDeletePatients: true,
          canEditMedicines: true,
          canDeleteMedicines: true,
          canMarkDoses: true,
          canManageInventory: true,
          canExportData: true,
          canImportData: true,
          canClearData: true
        }
      },
      { 
        username: 'caregiver', 
        password: 'care123', 
        name: 'Caregiver',
        role: 'caregiver',
        permissions: {
          canViewAll: true,
          canEditPatients: false,
          canDeletePatients: false,
          canEditMedicines: true,
          canDeleteMedicines: false,
          canMarkDoses: true,
          canManageInventory: true,
          canExportData: true,
          canImportData: false,
          canClearData: false
        }
      },
      { 
        username: 'family', 
        password: 'family123', 
        name: 'Family Member',
        role: 'family',
        permissions: {
          canViewAll: true,
          canEditPatients: false,
          canDeletePatients: false,
          canEditMedicines: false,
          canDeleteMedicines: false,
          canMarkDoses: true,
          canManageInventory: false,
          canExportData: false,
          canImportData: false,
          canClearData: false
        }
      }
    ]
    
    const user = validCredentials.find(
      cred => cred.username === username && cred.password === password
    )
    
    if (user) {
      const authData = {
        user: { 
          username: user.username, 
          name: user.name,
          role: user.role,
          permissions: user.permissions
        },
        expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      }
      
      localStorage.setItem('medicine-tracker-auth', JSON.stringify(authData))
      setIsAuthenticated(true)
      setUser(authData.user)
      
      return { success: true }
    } else {
      return { success: false, error: 'Invalid username or password' }
    }
  }
  
  // Helper function to check permissions
  const hasPermission = (permission) => {
    return user?.permissions?.[permission] === true
  }
  
  // Helper function to check role
  const hasRole = (role) => {
    return user?.role === role
  }

  const logout = () => {
    localStorage.removeItem('medicine-tracker-auth')
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
