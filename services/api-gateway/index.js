require('dotenv').config();
const createServer = require('./server');

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
