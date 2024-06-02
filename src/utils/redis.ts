import env from '@config/index';
import { createClient, type RedisClientOptions } from 'redis';

export const redisOptions: RedisClientOptions = {
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  },
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD
};

const createRedisClient = (opts: RedisClientOptions) => {
  const client = createClient(opts);

  client.on('error', (err) => {
    console.error(`Redis client error: ${err}`);
  });

  return client;
};

export const redisClient = createRedisClient(redisOptions);

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
