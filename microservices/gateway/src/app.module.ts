import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { AxiosService } from './services/axios.service'
import { AuthServiceController } from './controllers/auth/auth-service.controller'
import { AuthGuard } from './guards/auth.guard'
import { UsersBuyerController } from './controllers/users/users-buyer.controller'
import { UsersSellerController } from './controllers/users/users-seller.controller'
import { AppService } from './services/app.service'
import { CachingModule } from './caching/caching.module'
import { SocketService } from './services/socket.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    CachingModule
  ],
  controllers: [AppController, AuthServiceController, UsersBuyerController, UsersSellerController],
  providers: [AuthGuard, Logger, AxiosService, AppService, SocketService]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly socketService: SocketService) {}

  async onModuleInit() {
    await this.socketService.createClientAndServers()
    await this.socketService.listen()
  }
}
