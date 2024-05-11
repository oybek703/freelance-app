import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { SequelizeModule } from '@nestjs/sequelize'
import { getSequelizeConfig } from './shared/configs/sequelize.config'
import { UserMiddleware } from './shared/middlewares/user.middleware'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { AppService } from './app.service'
import { CloudinaryService } from './cloudinary.service'
import { AuthEmailProducer } from './producers/auth-email.producer'
import { BuyerUpdateProducer } from './producers/buyer-update.producer'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    SequelizeModule.forRootAsync({ inject: [ConfigService], useFactory: getSequelizeConfig })
  ],
  controllers: [AppController],
  providers: [Logger, AppService, CloudinaryService, AuthEmailProducer, BuyerUpdateProducer]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
