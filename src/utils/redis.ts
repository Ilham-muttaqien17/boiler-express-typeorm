import env from '@config/index';
import { Redis, RedisOptions } from 'ioredis';

export const redisOptions: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  enableOfflineQueue: false
};

export const redisClient = new Redis(redisOptions);

export const useRedisClient = {
  setData: async (key: string, value: any, ex?: number) => {
    if (ex) return await redisClient.set(key, value, 'EX', ex);
    await redisClient.set(key, value);
  },
  getData: async (key: string) => {
    const result = await redisClient.get(key);
    return result;
  },
  deleteData: async (key: string) => {
    return await redisClient.del(key);
  }
};
