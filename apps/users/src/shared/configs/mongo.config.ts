import { ConfigService } from '@nestjs/config'
import { UsersEnvVariableKeys } from '../app.constants'
import { MongooseModuleOptions } from '@nestjs/mongoose'

export const getMongoConfig = (configService: ConfigService): MongooseModuleOptions => {
  const mongoURL = configService.get<string>(UsersEnvVariableKeys.mongoURL)
  return {
    uri: mongoURL
  }
}
