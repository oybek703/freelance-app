import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRmqConfig } from './shared/configs/rmq.config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { MongooseModule } from '@nestjs/mongoose'
import { getMongoConfig } from './shared/configs/mongo.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: getMongoConfig })
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
