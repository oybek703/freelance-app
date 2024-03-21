import { Logger } from 'winston'
import { GatewayEnvVariableKeys } from '../app.constants'
import { ConfigService } from '@nestjs/config'
import { MicroserviceNames, winstonLogger } from '@freelance-app/helpers'
import { LogLevel } from '@nestjs/common'

export const getLogger = (configService: ConfigService, level: LogLevel = 'log'): Logger => {
  const elasticsearchUrl = configService.get<string>(GatewayEnvVariableKeys.elasticsearchUrl)
  return winstonLogger(elasticsearchUrl, MicroserviceNames.gateway, level)()
}
