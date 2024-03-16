import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './configs/elasticsearch.config'
import { RMQModule } from 'nestjs-rmq'
import { getRmqConfig } from './configs/rmq.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RMQModule.forRootAsync({ inject: [ConfigService], useFactory: getRmqConfig })
  ],
  controllers: [AppController]
})
export class AppModule {}
