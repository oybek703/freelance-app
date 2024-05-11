import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../app.constants'
import { SequelizeModuleOptions } from '@nestjs/sequelize'
import { User } from '../../models/user.model'

export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const mysqlBbURL = configService.get<string>(AuthEnvVariableKeys.mysqlBbURL)
  return {
    dialect: 'mysql',
    uri: mysqlBbURL,
    logging: false,
    synchronize: true,
    models: [User]
  }
}
