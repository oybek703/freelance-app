import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { NotificationsEnvVariableKeys } from './app.constants'
import { getLogger } from './configs/logger.config'
import { WinstonModule } from 'nest-winston'
import { ShutdownSignal } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = getLogger(configService, 'debug')
  app.useLogger(WinstonModule.createLogger({ instance: logger }))
  app.enableShutdownHooks([ShutdownSignal.SIGINT])
  const port = configService.get<number>(NotificationsEnvVariableKeys.port)
  await app.listen(port)
  logger.log('info', `Notifications service is running on port ${port}`)
}

bootstrap()
