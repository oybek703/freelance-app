import { ConfigService } from '@nestjs/config'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { ChatEnvVariableKeys } from '../app.constants'
import { OrderEmail } from '@oybek703/freelance-app-shared'

export const getRmqConfig = (configService: ConfigService): RabbitMQConfig => {
  const rabbitmqEndpoint = configService.get<string>(ChatEnvVariableKeys.rabbitmqEndpoint)
  return {
    uri: rabbitmqEndpoint,
    exchanges: [
      {
        name: OrderEmail.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      }
    ],
    queues: [
      {
        name: OrderEmail.queue,
        routingKey: OrderEmail.routingKey,
        createQueueIfNotExists: true,
        exchange: OrderEmail.exchange
      }
    ]
  }
}
