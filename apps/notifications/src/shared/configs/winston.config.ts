import { WinstonModuleOptions } from 'nest-winston'
import { getLoggerConfig } from '@freelance-app/configs'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from '../app.constants'
import { MicroserviceNames } from '@freelance-app/helpers'

export const getWinstonConfig = (configService: ConfigService): WinstonModuleOptions => {
  const elasticSearchUrl = configService.get<string>(EnvVariableKeys.elasticSearchUrl)
  return getLoggerConfig(elasticSearchUrl, MicroserviceNames.notification, 'debug')()
}
