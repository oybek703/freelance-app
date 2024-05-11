import { Sequelize } from 'sequelize-typescript'
import { User } from '../models/user.model'
import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys, ProviderKeys } from '../../shared/app.constants'
import { Provider } from '@nestjs/common'

export const databaseProviders: Provider[] = [
  {
    provide: ProviderKeys.SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const mysqlDbHost = configService.get<string>(AuthEnvVariableKeys.mysqlDbHost)
      const mysqlDbPort = configService.get<number>(AuthEnvVariableKeys.mysqlDbPort)
      const mysqlDbUsername = configService.get<string>(AuthEnvVariableKeys.mysqlDbUsername)
      const mysqlDbPassword = configService.get<string>(AuthEnvVariableKeys.mysqlDbPassword)
      const mysqlDbName = configService.get<string>(AuthEnvVariableKeys.mysqlDbName)
      const sequelize = new Sequelize({
        dialect: 'mysql',
        port: mysqlDbPort,
        host: mysqlDbHost,
        username: mysqlDbUsername,
        password: mysqlDbPassword,
        database: mysqlDbName
      })
      sequelize.addModels([User])
      await sequelize.sync()
      return sequelize
    }
  }
]
