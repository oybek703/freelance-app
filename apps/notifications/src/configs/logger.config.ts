import { config } from 'dotenv'
import { Logger } from 'winston'
import { EnvVariableKeys } from '../app.constants'
import { ConfigService } from '@nestjs/config'
import { MicroserviceNames, winstonLogger } from '@freelance-app/helpers'
import { LogLevel } from '@nestjs/common'

// Load env config
config()
const configService = new ConfigService()

export const getLogger = (level: LogLevel = 'log'): Logger => {
  const elasticsearchUrl = configService.get<string>(EnvVariableKeys.elasticsearchUrl)
  return winstonLogger(elasticsearchUrl, MicroserviceNames.notification, level)()
}
