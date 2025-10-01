import { apiCall } from './client'
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
  data: {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: string
  },
  message: string,
  statusCode: number
}

export interface TokenValidationResponse {
  valid: boolean
  user: User
}

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (data: RegisterData): Promise<AuthResponse> =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  logout: (): Promise<void> =>
    apiCall('/auth/logout', { method: 'POST' }),

  validateToken: (): Promise<TokenValidationResponse> =>
    apiCall('/auth/verify', { method: 'GET' }),
}

export default authApi