import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';


// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'https://api.reserve.expert' });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.status === 401){
      SecureStore.deleteItemAsync('AUTH_TOKEN')
    }
    Promise.reject((error.response && error.response.data) || 'Something went wrong')
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  merchant: {
    info: '/api/me',
  },
  booking: {
    list: '/api/booking/business/',
    info: '/api/booking/',
  },
  business: {
    list: '/api/businesses/',
    my: '/api/businesses/my',
  },
  offer: {
    list: '/api/offers',
  },
  workingHours: {
    list: '/api/working-hours/',
  },
  attachements: '/api/attachments',
  analytics: {
    booking: '/api/analytics/booking',
  },
};
