import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolves the backend URL for web, Android emulator, and physical devices.
export const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return 'http://10.0.2.2:3000/api';
  }

  // When running in Expo Go on a physical phone, hostUri gives the machine's LAN IP.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    return `http://${hostIp}:3000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the Android emulator host mapping fails, retry against localhost.
    if (error.config && !error.config.__isRetry && Platform.OS === 'android') {
      error.config.__isRetry = true;
      try {
        error.config.baseURL = 'http://localhost:3000/api';
        return await axios.request(error.config);
      } catch (retryErr) {
        return Promise.reject(retryErr);
      }
    }
    return Promise.reject(error);
  }
);
