import { ConfigService } from '@nestjs/config'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { AuthEnvVariableKeys } from '../app.constants'
import { AuthEmail, BuyerUpdate } from '@oybek703/freelance-app-shared'

export const getRmqConfig = (configService: ConfigService): RabbitMQConfig => {
  const rabbitmqEndpoint = configService.get<string>(AuthEnvVariableKeys.rabbitmqEndpoint)
  return {
    uri: rabbitmqEndpoint,
    exchanges: [
      {
        name: AuthEmail.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      },
      {
        name: BuyerUpdate.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      }
    ],
    queues: [
      {
        name: AuthEmail.queue,
        routingKey: AuthEmail.routingKey,
        createQueueIfNotExists: true,
        exchange: AuthEmail.exchange
      },
      {
        name: BuyerUpdate.queue,
        routingKey: BuyerUpdate.routingKey,
        createQueueIfNotExists: true,
        exchange: BuyerUpdate.exchange
      }
    ]
  }
}
