import { Logger, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { getElasticsearchConfig } from './shared/configs/elasticsearch.config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { getRmqConfig } from './shared/configs/rmq.config'
import { UserMiddleware } from '@oybek703/freelance-app-shared'
import { ChatService } from './services/chat.service'
import { CloudinaryService } from './services/cloudinary.service'
import { MongooseModule } from '@nestjs/mongoose'
import { getMongooseConfig } from './shared/configs/mongoose.config'
import { SocketService } from './services/socket.service'
import { Conversation, ConversationSchema } from './schemas/conversation.schema'
import { Message, MessageSchema } from './schemas/message.schema'
import { MessageController } from './controllers/chat.controller'
import { OrderEmailProducer } from './producers/order-email.producer'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({ inject: [ConfigService], useFactory: getElasticsearchConfig }),
    RabbitMQModule.forRootAsync(RabbitMQModule, { inject: [ConfigService], useFactory: getRmqConfig }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: getMongooseConfig }),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema }
    ])
  ],
  controllers: [AppController, MessageController],
  providers: [Logger, ChatService, CloudinaryService, SocketService, OrderEmailProducer]
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly socketService: SocketService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }

  onModuleInit() {
    this.socketService.createIoServer()
  }
}
