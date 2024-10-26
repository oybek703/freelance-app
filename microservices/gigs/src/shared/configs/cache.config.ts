import { ConfigService } from '@nestjs/config'
import { CacheModuleOptions } from '@nestjs/cache-manager'
import { redisStore, RedisStore } from 'cache-manager-redis-yet'
import { GigsEnvVariableKeys } from '../app.constants'

export const getCacheConfig = async (configService: ConfigService): Promise<CacheModuleOptions> => {
  const redisHost = configService.get(GigsEnvVariableKeys.redisHost)

  if (!redisHost)
    throw new Error(`Error while connecting to Redis cache: ${GigsEnvVariableKeys.redisHost} is required!`)

  // Save cache for 10 days
  const ttl = 10 * 86400 * 1000

  const store = (await redisStore({ socket: { host: redisHost, port: 6379 }, ttl })) as unknown as RedisStore

  return { store }
}
