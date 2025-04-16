import { redisClient } from '@src/utils/redis';
import { type IRateLimiterRedisOptions, RateLimiterRedis } from 'rate-limiter-flexible';

const options: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  points: 15, // limit each ip for 15 request per 1 minute
  duration: 60,
  keyPrefix: 'rate-limit'
};

export const rateLimiterRedis = new RateLimiterRedis(options);
