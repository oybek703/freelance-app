import { Logger } from 'winston'
import { ConfigService } from '@nestjs/config'
import { LogLevel } from '@nestjs/common'
import { ChatEnvVariableKeys } from '../app.constants'
import { MicroserviceNames, winstonLogger } from '@oybek703/freelance-app-shared'

export const getLogger = (configService: ConfigService, level: LogLevel = 'log'): Logger => {
  const elasticsearchUrl = configService.get<string>(ChatEnvVariableKeys.elasticsearchUrl)
  return winstonLogger(elasticsearchUrl, MicroserviceNames.chat, level)()
}
