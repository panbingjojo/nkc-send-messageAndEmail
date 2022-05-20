const Redis = require('redis');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.multi.prototype);

/*
 * 重置redis集合
 * @param {String} key 键名
 * @param {Array} values 新数据
 * */
Redis.RedisClient.prototype.resetSetAsync = async function (
  key: any,
  values: any = [],
) {
  const _values = await this.smembersAsync(key);
  const _removeValues = _values.filter((v: any) => !values.includes(v));
  if (_removeValues.length) await this.sremAsync(key, _removeValues);
  if (values.length) {
    await this.saddAsync(key, values);
  } else {
    await this.delAsync(key);
  }
};

/*
 * 存JSON
 * */
Redis.RedisClient.prototype.setAsJsonString = async function (
  key: any,
  data: any,
) {
  await this.setAsync(key, JSON.stringify(data));
};
/*
 * 取JSON
 * */
Redis.RedisClient.prototype.getFromJsonString = async function (key: any) {
  const data = await this.getAsync(key);
  return data ? JSON.parse(data) : null;
};
/*
 * 存数组JSON
 * */
Redis.RedisClient.prototype.setArray = async function (
  key: any,
  data: any = [],
) {
  await this.setAsJsonString(key, data);
};
/*
 * 取数组JSON
 * */
Redis.RedisClient.prototype.getArray = async function (key: any) {
  return (await this.getFromJsonString(key)) || [];
};

const redisConfig = require('../config/redis');

module.exports = () => {
  return Redis.createClient({
    host: redisConfig.address,
    port: redisConfig.port,
    db: redisConfig.db,
  });
};
