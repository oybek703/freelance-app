import { Logger } from 'winston'
import { NotificationsEnvVariableKeys } from '../app.constants'
import { ConfigService } from '@nestjs/config'
import { LogLevel } from '@nestjs/common'
import { MicroserviceNames, winstonLogger } from '@oybek703/freelance-app-shared'

export const getLogger = (configService: ConfigService, level: LogLevel = 'log'): Logger => {
  const elasticsearchUrl = configService.get<string>(NotificationsEnvVariableKeys.elasticsearchUrl)
  return winstonLogger(elasticsearchUrl, MicroserviceNames.notification, level)()
}
