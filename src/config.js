var key = null;

try {
  key = require('../config/key');
} catch (err) {
  console.error('../config/key.js is not found. Please create it.')
  process.exit(1);
}

export default {
  port: 3000,
  cors: require('../config/cors'),
  key: key,
  viewsDir: '/views'
};
