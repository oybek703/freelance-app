import { Logger, Module } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { AxiosService } from './axios.service'
import { AuthServiceController } from './controllers/auth-service.controller'
import { AuthGuard } from './guards/auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig })
  ],
  controllers: [AppController, AuthServiceController],
  providers: [AuthGuard, Logger, AxiosService]
})
export class AppModule {}
