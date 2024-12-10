import httpClient from './httpClient';

const authService = {
  login: (data) => httpClient.post('/users/auth/login', data),
  register: (data) => httpClient.post('/users/auth/register', data),
};

export default authService;
