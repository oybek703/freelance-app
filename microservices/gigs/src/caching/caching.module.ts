import { Module } from '@nestjs/common'
import { CachingService } from './caching.service'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { getCacheConfig } from '../shared/configs/cache.config'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: getCacheConfig
    })
  ],
  providers: [CachingService],
  exports: [CachingService]
})
export class CachingModule {}
