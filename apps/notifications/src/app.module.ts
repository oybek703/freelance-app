import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './configs/elasticsearch.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig })
  ],
  controllers: [AppController]
})
export class AppModule {}
