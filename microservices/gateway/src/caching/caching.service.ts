import { Injectable, Logger } from '@nestjs/common'
import { createClient } from 'redis'
import { GatewayEnvVariableKeys, loggedInUsersCacheKey } from '../shared/app.constants'
import { ConfigService } from '@nestjs/config'
import { GigCacheCategoryKeys } from '@oybek703/freelance-app-shared'

@Injectable()
export class CachingService {
  private readonly logger = new Logger(CachingService.name)
  private readonly client: ReturnType<typeof createClient>

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>(GatewayEnvVariableKeys.redisHost)
    this.client = createClient({ url: `redis://${redisHost}:6379` })
  }

  async getLoggedInUsersFromCache() {
    return this.client.LRANGE(loggedInUsersCacheKey, 0, -1)
  }

  async saveLoggedInUsers(username: string) {
    const index = await this.client.LPOS(loggedInUsersCacheKey, username)
    if (index === null) {
      await this.client.LPUSH(loggedInUsersCacheKey, username)
      this.logger.log(`User added to cache: ${username}`)
    }
    return this.client.LRANGE(loggedInUsersCacheKey, 0, -1)
  }

  async removeLoggedInUserFromCache(username: string) {
    await this.client.LREM(loggedInUsersCacheKey, 1, username)
    this.logger.log(`User removed from cache: ${username}`)
    return this.client.LRANGE(loggedInUsersCacheKey, 0, -1)
  }

  async saveUserSelectedCategory(category: string, username: string) {
    await this.client.SET(`${GigCacheCategoryKeys.selectedCategories}:${username}`, category)
  }
}
