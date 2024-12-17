import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // API Gateway URL
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("gateway url:" + process.env.REACT_APP_API_URL)

// Attach access token to requests
httpClient.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) { 
  console.log(JSON.parse(user))
  const token = JSON.parse(user)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (Unauthorized)
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      try {
        //FINISH
        /*
        if (refreshedUser) {
          return httpClient.request(error.config); // Retry the original request
        }*/
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
