import { ConfigService } from '@nestjs/config'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { UsersEnvVariableKeys } from '../app.constants'
import { BuyerUpdate } from '@oybek703/freelance-app-shared'

export const getRmqConfig = (configService: ConfigService): RabbitMQConfig => {
  const rabbitmqEndpoint = configService.get<string>(UsersEnvVariableKeys.rabbitmqEndpoint)
  return {
    uri: rabbitmqEndpoint,
    exchanges: [
      {
        name: BuyerUpdate.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      }
    ],
    queues: [
      {
        name: BuyerUpdate.queue,
        routingKey: BuyerUpdate.routingKey,
        createQueueIfNotExists: true,
        exchange: BuyerUpdate.exchange
      }
    ]
  }
}
