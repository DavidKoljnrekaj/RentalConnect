require('dotenv').config();
const createServer = require('./server');

const PORT = process.env.PORT || 3000;

const app = createServer();

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}
else {
module.exports = app
}