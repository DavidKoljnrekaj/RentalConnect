const axios = require('axios');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    // Validate token with the User Service
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/auth/authorize`, {
      headers: { Authorization: token },
    });

    if (!response.data.valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Attach user details to request
    req.user = response.data;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authorization failed' });
  }
};