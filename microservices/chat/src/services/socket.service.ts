import { Injectable } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Server } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import { ChatEnvVariableKeys } from '../shared/app.constants'

@Injectable()
export class SocketService {
  public io: Server

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService
  ) {}

  createIoServer() {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer()
    const apiGatewayURL = this.configService.get<string>(ChatEnvVariableKeys.apiGatewayURL)
    this.io = new Server(httpServer, {
      cors: { origin: apiGatewayURL, methods: ['PUT', 'POST', 'DELETE', 'GET', 'OPTIONS'] }
    })
  }
}
