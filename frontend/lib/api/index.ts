// Export simplified API client
export { getAuthHeaders, apiCall } from './client'

// Export auth API
import { authApi } from './auth'
export { authApi }
export type * from './auth'

// Simple API object
export const api = {
  auth: authApi,
}