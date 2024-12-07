import { Logger, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { ElasticSearchIndexNames, UserMiddleware } from '@oybek703/freelance-app-shared'
import { GigService } from './services/gig.service'
import { CloudinaryService } from './services/cloudinary.service'
import { SellerUpdateProducer } from './producers/seller-update.producer'
import { GigUpdateConsumer } from './consumers/gig-update.consumer'
import { CachingModule } from './caching/caching.module'
import { SeedGigsProducer } from './producers/seed-gigs.producer'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    CachingModule
  ],
  controllers: [AppController],
  providers: [Logger, GigService, CloudinaryService, SellerUpdateProducer, GigUpdateConsumer, SeedGigsProducer]
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
