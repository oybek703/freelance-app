import { Logger } from 'winston'
import { ConfigService } from '@nestjs/config'
import { MicroserviceNames, winstonLogger } from '@freelance-app/helpers'
import { LogLevel } from '@nestjs/common'
import { AuthEnvVariableKeys } from '../app.constants'

export const getLogger = (configService: ConfigService, level: LogLevel = 'log'): Logger => {
  const elasticsearchUrl = configService.get<string>(AuthEnvVariableKeys.elasticsearchUrl)
  return winstonLogger(elasticsearchUrl, MicroserviceNames.auth, level)()
}
