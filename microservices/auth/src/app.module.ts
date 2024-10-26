import { Logger, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { AppService } from './services/app.service'
import { CloudinaryService } from './services/cloudinary.service'
import { AuthEmailProducer } from './producers/auth-email.producer'
import { BuyerUpdateProducer } from './producers/buyer-update.producer'
import { DatabaseModule } from './database/database.module'
import { SearchService } from './services/search.service'
import { ElasticSearchIndexNames, UserMiddleware } from '@oybek703/freelance-app-shared'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [Logger, AppService, CloudinaryService, AuthEmailProducer, BuyerUpdateProducer, SearchService]
})
export class AppModule implements NestModule, OnModuleInit {
  private readonly logger = new Logger(AppModule.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }

  async onModuleInit() {
    const checkGigsIndexExistence = await this.elasticsearchService.indices.exists({
      index: ElasticSearchIndexNames.gigs
    })
    if (checkGigsIndexExistence) return this.logger.warn(`${ElasticSearchIndexNames.gigs} index already exists.`)
    await this.elasticsearchService.indices.create({ index: ElasticSearchIndexNames.gigs })
    this.logger.log(`${ElasticSearchIndexNames.gigs} index created.`)
  }
}
