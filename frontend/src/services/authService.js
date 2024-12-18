import httpClient from './httpClient';

const authService = {
  /**
   * Login method that updates the AuthContext on success
   * @param {object} data - { username, password }
   * @param {function} login - AuthContext login function
   * @returns {Promise<void>} 
   */
  login: async (data, login) => {
    try {
      const response = await httpClient.post('/users/auth/login', data);
      const userData = response.data;
      login(userData); // Update the AuthContext
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error.response?.data?.message || 'Login failed';
    }
  },

  /**
   * Register method
   * @param {object} data - { username, email, password }
   * @returns {Promise<object>} - Newly created user data
   */
  register: async (data) => {
    try {
      const response = await httpClient.post('/users/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error.response?.data?.message || 'Registration failed';
    }
  },
};

export default authService;
