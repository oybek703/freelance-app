import { ConfigService } from '@nestjs/config'
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq'
import { UsersEnvVariableKeys } from '../app.constants'
import { BuyerReview, BuyerUpdate, SeedGig, SellerUpdate, UpdateGig } from '@oybek703/freelance-app-shared'

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
        name: SellerUpdate.exchange,
        options: { durable: true, autoDelete: false },
        type: 'direct',
        createExchangeIfNotExists: true
      },
      {
        name: BuyerReview.exchange,
        options: { durable: true, autoDelete: false },
        type: 'fanout',
        createExchangeIfNotExists: true
      }
    ],
    queues: [
      {
        name: BuyerUpdate.queue,
        routingKey: BuyerUpdate.routingKey,
        createQueueIfNotExists: true,
        exchange: BuyerUpdate.exchange
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
        name: SellerUpdate.queue,
        routingKey: SellerUpdate.routingKey,
        createQueueIfNotExists: true,
        exchange: SellerUpdate.exchange
      },
      {
        name: BuyerReview.queue,
        createQueueIfNotExists: true,
        exchange: BuyerReview.exchange
      }
    ]
  }
}
