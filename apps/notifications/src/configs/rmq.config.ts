import { IRMQServiceOptions } from 'nestjs-rmq/dist/interfaces/rmq-options.interface'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from '../app.constants'
import { MicroserviceNames } from '@freelance-app/helpers'

export const getRmqConfig = (configService: ConfigService): IRMQServiceOptions => {
  const rabbitmqExchange = configService.get(EnvVariableKeys.rabbitmqExchange)
  const rabbitmqHost = configService.get(EnvVariableKeys.rabbitmqHost)
  const rabbitmqPort = configService.get(EnvVariableKeys.rabbitmqPort)
  const rabbitmqUser = configService.get(EnvVariableKeys.rabbitmqUser)
  const rabbitmqPassword = configService.get(EnvVariableKeys.rabbitmqPassword)
  return {
    exchangeName: rabbitmqExchange,
    connections: [{ host: rabbitmqHost, port: rabbitmqPort, login: rabbitmqUser, password: rabbitmqPassword }],
    serviceName: MicroserviceNames.notification
  }
}
