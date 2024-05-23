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
    await redisClient.connect();
    const opts = ex ? { EX: ex } : {};
    await redisClient.set(key, value, opts);
    await redisClient.disconnect();
  },
  getData: async (key: string) => {
    await redisClient.connect();
    const result = await redisClient.get(key);
    await redisClient.disconnect();
    return result;
  }
};
