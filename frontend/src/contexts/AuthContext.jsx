import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService, checkTokenExpiration } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  )
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const response = await authService.verifyToken()
          if (response && response.valid && response.user) {
            // El backend CRM puede devolver 'usuario' o 'user'
            const userData = response.user;
            setUser(userData)
            setIsAuthenticated(true)
            // Guardar usuario en localStorage para persistencia
            localStorage.setItem('user', JSON.stringify(userData))
          } else {
            // Token inválido
            localStorage.removeItem('authToken')
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('user')
            setIsAuthenticated(false)
            setUser(null)
          }
        } catch (error) {
          console.error('Error verifying token:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
          setUser(null)
        }
      }
      setLoading(false)
    }

    verifyAuth()
  }, [])

  // Verificación periódica del token (cada 30 segundos)
  useEffect(() => {
    if (!isAuthenticated) return

    const checkToken = () => {
      const tokenStatus = checkTokenExpiration(false) // No mostrar alerts automáticamente
      
      if (tokenStatus === 'expired') {
        console.log('🔐 Token expirado detectado - cerrando sesión automáticamente')
        
        // Limpiar localStorage
        localStorage.removeItem('authToken')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        
        // Actualizar estado
        setIsAuthenticated(false)
        setUser(null)
        
        // Redirigir a login
        window.location.href = '/login'
      }
    }

    // Verificar inmediatamente
    checkToken()

    // Configurar intervalo para verificar cada 30 segundos
    const interval = setInterval(checkToken, 30000)

    // Limpiar intervalo al desmontar o cuando cambie isAuthenticated
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('isAuthenticated', 'true')
        // El backend CRM devuelve 'usuario' en lugar de 'user'
        const userData = response.usuario || response.user;
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        setIsAuthenticated(true)
        // Redirigir usando window.location
        window.location.href = '/admin'
        return { success: true, message: 'Login successful' }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.error || 'Error al iniciar sesión'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      setUser(null)
      setIsAuthenticated(false)
      // Redirigir usando window.location
      window.location.href = '/login'
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}