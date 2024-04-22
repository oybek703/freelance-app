import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { ShutdownSignal } from '@nestjs/common'
import { getLogger } from './shared/configs/logger.config'
import { AuthEnvVariableKeys } from './shared/app.constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = getLogger(configService, 'debug')
  app.useLogger(WinstonModule.createLogger({ instance: logger }))
  app.enableShutdownHooks([ShutdownSignal.SIGINT])
  const port = configService.get<number>(AuthEnvVariableKeys.port)
  await app.listen(port)
  logger.log('info', `Auth service is running on port ${port}`)
}

bootstrap()
