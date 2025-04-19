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

  async get(endpoint: string, params?: Record<string, any>) {
    const token = await SecureStore.getItemAsync('userToken');
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    
    return this.request(`${endpoint}${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }

  async post(endpoint: string, data?: any) {
    const token = await SecureStore.getItemAsync('userToken');
    
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
  }

  async put(endpoint: string, data?: any) {
    const token = await SecureStore.getItemAsync('userToken');
    
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint: string, data?: any) {
    const token = await SecureStore.getItemAsync('userToken');
    
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    return this.request(endpoint, options);
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Default headers
    options.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, options);
      
      // Handle 204 No Content responses
      if (response.status === 204) {
        return { success: true };
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (error instanceof SyntaxError) {
        throw new Error('Invalid response format');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Unknown API error occurred');
    }
  }
}

export const apiService = new ApiService();
export default apiService;