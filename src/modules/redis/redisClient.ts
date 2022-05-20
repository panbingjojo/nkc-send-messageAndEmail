const redis = require('./redis');
const redisClient = redis();
redisClient.on('error', (err: any) => {
  console.log(err);
});
module.exports = redisClient;
