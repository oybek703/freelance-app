import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonModule } from 'nest-winston'
import { getLogger } from './shared/configs/logger.config'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import cookieSession from 'cookie-session'
import { GatewayEnvVariableKeys } from './shared/app.constants'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = getLogger(configService, 'debug')
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(WinstonModule.createLogger({ instance: logger }))
  const port = configService.get<number>(GatewayEnvVariableKeys.port)
  const clientUrl = configService.get<string>(GatewayEnvVariableKeys.clientUrl)
  const secretKeyOne = configService.get<string>(GatewayEnvVariableKeys.secretKeyOne)
  const secretKeyTwo = configService.get<string>(GatewayEnvVariableKeys.secretKeyTwo)
  const nodeEnv = configService.get<string>(GatewayEnvVariableKeys.nodeEnv)
  app.use(
    cookieSession({
      name: 'session',
      keys: [secretKeyOne, secretKeyTwo],
      // Set expire date to 7 days
      maxAge: 7 * 86400 * 1000,
      secure: nodeEnv !== 'development'
    })
  )
  app.use(helmet())
  app.enableCors({ credentials: true, origin: clientUrl })
  await app.listen(port)
  logger.log('info', `Gateway service is running on port ${port}`)
}

bootstrap()
