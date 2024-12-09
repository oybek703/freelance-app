import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { ShutdownSignal, ValidationPipe } from '@nestjs/common'
import { getLogger } from './shared/configs/logger.config'
import { ChatEnvVariableKeys } from './shared/app.constants'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)
  const apiGatewayURL = configService.get<string>(ChatEnvVariableKeys.apiGatewayURL)
  app.enableCors({ origin: [apiGatewayURL], credentials: true })
  const logger = getLogger(configService, 'debug')
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(WinstonModule.createLogger({ instance: logger }))
  app.enableShutdownHooks([ShutdownSignal.SIGINT])
  const port = configService.get<number>(ChatEnvVariableKeys.port)
  await app.listen(port)
  logger.log('info', `Chat service is running on port ${port}`)
}

bootstrap()
