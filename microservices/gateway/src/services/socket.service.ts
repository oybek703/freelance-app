import { Injectable, Logger } from '@nestjs/common'
import { CachingService } from '../caching/caching.service'
import { Server, Socket } from 'socket.io'
import { HttpAdapterHost } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { GatewayEnvVariableKeys, SocketServiceEvents } from '../shared/app.constants'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import { io, Socket as SocketClient } from 'socket.io-client'
import { ChatServiceEventNames } from '@oybek703/freelance-app-shared'

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name)
  public io: Server
  private ioClient: SocketClient

  constructor(
    private readonly cachingService: CachingService,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService
  ) {}

  createIoServer() {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer()
    const clientURL = this.configService.get<string>(GatewayEnvVariableKeys.clientURL)
    this.io = new Server(httpServer, {
      cors: { origin: clientURL, methods: ['PUT', 'POST', 'DELETE', 'GET', 'OPTIONS'] }
    })
  }

  async createClientAndServers() {
    const redisHost = this.configService.get<string>(GatewayEnvVariableKeys.redisHost)
    const pubClient = createClient({ url: `redis://${redisHost}:6379` })
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()])
    this.io.adapter(createAdapter(pubClient, subClient))
  }

  async listen() {
    this.chatServiceConnectIO()
    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUsers', async () => {
        const loggedInUsers = await this.cachingService.getLoggedInUsersFromCache()
        this.io.emit(SocketServiceEvents.online, loggedInUsers)
      })

      socket.on('loggedInUsers', async (username: string) => {
        const loggedInUsers = await this.cachingService.saveLoggedInUsers(username)
        this.io.emit(SocketServiceEvents.online, loggedInUsers)
      })

      socket.on('removeLoggedInUser', async (username: string) => {
        const loggedInUsers = await this.cachingService.removeLoggedInUserFromCache(username)
        this.io.emit(SocketServiceEvents.online, loggedInUsers)
      })

      socket.on('category', async (category: string, username: string) => {
        await this.cachingService.saveUserSelectedCategory(category, username)
      })
    })
  }

  chatServiceConnectIO() {
    const chatBaseURL = this.configService.get(GatewayEnvVariableKeys.chatBaseURL)
    this.ioClient = io(chatBaseURL, { transports: ['websocket', 'polling'], secure: true })
    this.ioClient.on('connect', () => this.logger.verbose('Chat service io connection created successfully.'))
    this.ioClient.on('disconnect', reason => {
      this.logger.error(`Chat service io disconnected, reason: ${reason}`)
      this.ioClient.connect()
    })
    this.ioClient.on('connect_error', err => {
      this.logger.error(`Chat service io connection error: ${err}`)
      this.ioClient.connect()
    })
    this.ioClient.on(ChatServiceEventNames.messageReceived, (data: unknown) =>
      this.ioClient.emit(ChatServiceEventNames.messageReceived, data)
    )
    this.ioClient.on(ChatServiceEventNames.messageUpdated, (data: unknown) =>
      this.ioClient.emit(ChatServiceEventNames.messageUpdated, data)
    )
  }
}
