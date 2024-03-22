import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { AuthGuard } from './guards/auth.guard'
import { UserGuard } from './guards/user.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig })
  ],
  controllers: [AppController],
  providers: [AuthGuard, UserGuard, Logger]
})
export class AppModule {}
