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
import { BuyerController } from './controllers/buyer.controller'
import { Buyer, buyerSchema } from './schemas/buyer.schema'
import { BuyerService } from './services/buyer.service'
import { SellerService } from './services/seller.service'
import { Seller, sellerSchema } from './schemas/seller.schema'
import { SellerController } from './controllers/seller.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: getMongoConfig }),
    MongooseModule.forFeature([
      { name: Buyer.name, schema: buyerSchema },
      { name: Seller.name, schema: sellerSchema }
    ])
  ],
  controllers: [AppController, BuyerController, SellerController],
  providers: [Logger, BuyerService, SellerService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
