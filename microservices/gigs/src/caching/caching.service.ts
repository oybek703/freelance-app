import { Inject, Injectable, Logger } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CachingService {
  private readonly logger = new Logger(CachingService.name)

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getValueFromCache(key: string): Promise<string | undefined> {
    try {
      return this.cache.get<string>(key)
    } catch (e) {
      this.logger.error(`Error while getting value by key from redis cache: ${JSON.stringify({ key })}, \n ${e}`)
      return
    }
  }
}
