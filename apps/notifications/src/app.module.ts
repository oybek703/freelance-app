import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './configs/rmq.config'
import { AuthEmailConsumer } from './consumers/auth-email.consumer'
import { OrderEmailConsumer } from './consumers/order-email.consumer'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig })
  ],
  controllers: [AppController],
  providers: [AuthEmailConsumer, OrderEmailConsumer, Logger]
})
export class AppModule {}
