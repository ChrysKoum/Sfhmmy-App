import { API_CONFIG } from '@/constants/Config';
import * as SecureStore from 'expo-secure-store';

class ApiService {
  async login(email: string, password: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    const token = await SecureStore.getItemAsync('userToken');
    return this.request(`${API_CONFIG.ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Add more API methods as needed
}

export const apiService = new ApiService();