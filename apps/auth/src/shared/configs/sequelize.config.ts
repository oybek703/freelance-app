import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../app.constants'
import { SequelizeModuleOptions } from '@nestjs/sequelize'
import { Users } from '../../users/models/user.model'

export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const mysqlBbURL = configService.get<string>(AuthEnvVariableKeys.mysqlBbURL)
  return {
    uri: mysqlBbURL,
    logging: false,
    models: [Users],
    synchronize: true,
    autoLoadModels: true
  }
}
