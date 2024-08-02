import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../../auth/src/shared/app.constants'
import { ShutdownSignal, ValidationPipe } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { getLogger } from './shared/configs/logger.config'
import { UsersEnvVariableKeys } from './shared/app.constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const apiGatewayURL = configService.get<string>(UsersEnvVariableKeys.apiGatewayURL)
  app.enableCors({ origin: [apiGatewayURL], credentials: true })
  const logger = getLogger(configService, 'debug')
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(WinstonModule.createLogger({ instance: logger }))
  app.enableShutdownHooks([ShutdownSignal.SIGINT])
  const port = configService.get<number>(AuthEnvVariableKeys.port)
  await app.listen(port)
  logger.log('info', `Users service is running on port ${port}`)
}

bootstrap()
