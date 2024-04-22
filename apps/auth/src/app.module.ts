import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { SequelizeModule } from '@nestjs/sequelize'
import { getSequelizeConfig } from './shared/configs/sequelize.config'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    SequelizeModule.forRootAsync({ inject: [ConfigService], useFactory: getSequelizeConfig }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [Logger]
})
export class AppModule {}
