import { ConfigService } from '@nestjs/config'
import { MongooseModuleOptions } from '@nestjs/mongoose'
import { ChatEnvVariableKeys } from '../app.constants'

export const getMongooseConfig = (configService: ConfigService): MongooseModuleOptions => {
  const mongoURL = configService.get<string>(ChatEnvVariableKeys.mongoURL)
  return { uri: mongoURL }
}
