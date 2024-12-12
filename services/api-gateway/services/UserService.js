const axios = require('axios');
const url = process.env.USER_SERVICE_URL || 'http://localhost:3000'
const UserService = {
  authorize: async (token) => {
    try {
      const response = await axios.get(`${url}/auth/authorize`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      console.error('Error authorizing user:', error.message);
      throw new Error('Authorization failed');
    }
  },

  getFavorites: async (userId) => {
    try {
      const response = await axios.get(`${url}/users/${userId}/favorites`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error.message);
      throw error;
    }
  },
};

module.exports = UserService;
