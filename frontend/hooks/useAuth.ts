import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAppSelector, useAppDispatch, type RootState } from '../lib/store'
import { authApi } from '../lib/api'
import { 
  setLoading, 
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction, 
  clearError,
} from '../lib/store/features/authSlice'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, accessToken, isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth)
  const initialized = useRef(false)
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized.current) return
      initialized.current = true

      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        dispatch(setLoading(false))
        return
      }

      try {
        dispatch(setLoading(true))
        const response = await authApi.validateToken()
        dispatch(loginSuccess({ 
          user: response.user, 
          accessToken: storedToken, 
          refreshToken: storedToken 
        }))
      } catch (error) {
        console.error('Token validation failed:', error)
        localStorage.removeItem('token')
        dispatch(loginFailure('Session expired. Please log in again.'))
        toast.error('Session expired. Please log in again.')
      } finally {
        dispatch(setLoading(false))
      }
    }

    initializeAuth()
  }, [dispatch])

  const login = async (email: string, password: string) => {
    const loadingToast = toast.loading('Signing you in...')
    
    try {
      dispatch(loginStart())
      
      const response = await authApi.login({ email, password })
      console.log("🚀 ~ login ~ response:", response)
      localStorage.setItem('token', response.data.accessToken)
      dispatch(loginSuccess({ 
        user: response.data.user, 
        accessToken: response.data.accessToken, 
        refreshToken: response.data.refreshToken 
      }))
      
      toast.success(`Welcome back, ${response.data.user.name}!`, { id: loadingToast })
      return { success: true as const, user: response.data.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch(loginFailure(errorMessage))
      toast.error(errorMessage, { id: loadingToast })
      return { success: false as const, error: errorMessage }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const loadingToast = toast.loading('Creating your account...')
    
    try {
      dispatch(loginStart())
      
      const response = await authApi.register({ name, email, password })
      localStorage.setItem('token', response.data.accessToken)
      dispatch(loginSuccess({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      }))

      toast.success(`Welcome to VisionDesk, ${response.data.user.name}! 🎉`, { id: loadingToast })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch(loginFailure(errorMessage))
      toast.error(errorMessage, { id: loadingToast })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    const loadingToast = toast.loading('Signing you out...')
    
    try {
      await authApi.logout()
      toast.success('Signed out successfully', { id: loadingToast })
      router.push('/')
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
      toast.success('Signed out successfully', { id: loadingToast })
    } finally {
      localStorage.removeItem('token')
      dispatch(logoutAction())
    }
  }


  return {
    user,
    token: accessToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError: () => dispatch(clearError()),
  }
}