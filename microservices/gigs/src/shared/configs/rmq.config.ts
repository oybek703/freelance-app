import { ConfigService } from '@nestjs/config'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { GigsEnvVariableKeys } from '../app.constants'
import { GetSellers, SeedGig, SellerUpdate, UpdateGig } from '@oybek703/freelance-app-shared'

export const getRmqConfig = (configService: ConfigService): RabbitMQConfig => {
  const rabbitmqEndpoint = configService.get<string>(GigsEnvVariableKeys.rabbitmqEndpoint)
  return {
    uri: rabbitmqEndpoint,
    exchanges: [
      {
        name: SellerUpdate.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      },
      {
        name: UpdateGig.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      },
      {
        name: SeedGig.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      },
      {
        name: GetSellers.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      }
    ],
    queues: [
      {
        name: SellerUpdate.queue,
        routingKey: SellerUpdate.routingKey,
        createQueueIfNotExists: true,
        exchange: SellerUpdate.exchange
      },
      {
        name: UpdateGig.queue,
        routingKey: UpdateGig.routingKey,
        createQueueIfNotExists: true,
        exchange: UpdateGig.exchange
      },
      {
        name: SeedGig.queue,
        routingKey: SeedGig.routingKey,
        createQueueIfNotExists: true,
        exchange: SeedGig.exchange
      },
      {
        name: GetSellers.queue,
        routingKey: GetSellers.routingKey,
        createQueueIfNotExists: true,
        exchange: GetSellers.exchange
      }
    ]
  }
}
