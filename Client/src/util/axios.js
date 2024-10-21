import axios from "axios";
import { logoutUser } from '../Store/authSlice'; // Import the logout action from the auth slice
import store from '../Store/store'; // Import your Redux store

export const API_URL = import.meta.env.VITE_BACKEND_END_POINT + '/';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 15 * 1000,
});

instance.interceptors.request.use(async (request) => {
  const accessToken = localStorage.getItem("access");
  if (accessToken) {
    request.headers.authorization = `Bearer ${accessToken}`;
  }
  return request;
});

// Response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    
    if (error.response && error.response.status === 401) {
      console.log(error.response, error.response.status," error.response.status" )
      
      store.dispatch(logoutUser());

      
      window.location.href = '/login'; 
    }

    return Promise.reject(error);
  }
);

export default instance;
