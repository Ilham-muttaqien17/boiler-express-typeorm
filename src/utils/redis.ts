import env from '@config/index';
import { createClient } from 'redis';

export const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  },
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD
});

export const useRedisClient = {
  setData: async (key: string, value: any, ex?: number) => {
    const opts = ex ? { EX: ex } : {};
    await redisClient.set(key, value, opts);
  },
  getData: async (key: string) => {
    const result = await redisClient.get(key);
    return result;
  },
  deleteData: async (key: string) => {
    return await redisClient.del(key);
  }
};
