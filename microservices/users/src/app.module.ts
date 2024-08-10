import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { UserMiddleware } from '@oybek703/freelance-app-shared'
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
  providers: [Logger]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
