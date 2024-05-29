import { redisClient } from '@src/utils/redis';
import { IRateLimiterRedisOptions, RateLimiterRedis } from 'rate-limiter-flexible';

const options: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  useRedisPackage: true,
  points: 15, // limit each ip for 15 request per 1 minute
  duration: 60
};

export const rateLimiterRedis = new RateLimiterRedis(options);
