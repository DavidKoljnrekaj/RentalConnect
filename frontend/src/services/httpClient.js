import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // API Gateway URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
