import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from './app.constants'
import { getLogger } from './configs/logger.config'
import { WinstonModule } from 'nest-winston'

async function bootstrap() {
  const logger = getLogger('debug')
  const app = await NestFactory.create(AppModule, { logger: WinstonModule.createLogger({ instance: logger }) })
  const configService = app.get(ConfigService)
  const port = configService.get<number>(EnvVariableKeys.port)
  await app.listen(port)
  logger.log('info', `Notifications service is running on port ${port}`)
}

bootstrap()
