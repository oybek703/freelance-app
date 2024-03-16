import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { getWinstonConfig } from '../shared/configs/winston.config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticSearchConfig } from '../shared/configs/elastic-search.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRootAsync({ inject: [ConfigService], useFactory: getWinstonConfig }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticSearchConfig })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
