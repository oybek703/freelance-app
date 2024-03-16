import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from './shared/app.constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get(EnvVariableKeys.port)
  await app.listen(port)
  Logger.log(`🚀 Notification service is running on port ${port}`)
}

bootstrap()
