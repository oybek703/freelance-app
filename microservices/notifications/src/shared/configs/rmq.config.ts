import { ConfigService } from '@nestjs/config'
import { NotificationsEnvVariableKeys } from '../app.constants'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail, OrderEmail } from '@oybek703/freelance-app-shared'

export const getRmqConfig = (configService: ConfigService): RabbitMQConfig => {
  const rabbitmqEndpoint = configService.get<string>(NotificationsEnvVariableKeys.rabbitmqEndpoint)
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
        name: OrderEmail.exchange,
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
        name: OrderEmail.queue,
        routingKey: OrderEmail.routingKey,
        createQueueIfNotExists: true,
        exchange: OrderEmail.exchange
      }
    ]
  }
}
