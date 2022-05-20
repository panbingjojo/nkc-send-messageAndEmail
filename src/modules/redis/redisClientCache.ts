// import redisConfig from '../../config/redis';
const config = require('../../config/redis');
const ioredis = require('ioredis');

let client: any = null;

module.exports = async () => {
  if (!client) {
    client = new ioredis({
      port: config.prot,
      host: config.port,
      password: config.password,
      db: config.db,
    });
  }
  return client;
};
