import { apiClient } from './client'
import { User } from '../store/features/authSlice'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface TokenValidationResponse {
  valid: boolean
  user: User
}

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/auth/login', credentials),

  register: (data: RegisterData): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  validateToken: (): Promise<TokenValidationResponse> =>
    apiClient.get('/auth/verify'),
}

export default authApi