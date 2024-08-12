import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { BuyerUpdate } from '@oybek703/freelance-app-shared'
import { BuyerService } from '../services/buyer.service'

@Injectable()
export class BuyerUpdateConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(BuyerUpdateConsumer.name)

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly buyerService: BuyerService
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: BuyerUpdateConsumer.name })
    }
  }

  @RabbitRPC({
    exchange: BuyerUpdate.exchange,
    routingKey: BuyerUpdate.routingKey,
    queue: BuyerUpdate.queue
  })
  private async handleBuyerUpdate(msg: BuyerUpdate.Request) {
    const { type } = msg
    // If update is from auth, then create a new buyer
    if (type === BuyerUpdate.BuyerUpdatesTypes.auth)
      await this.buyerService.createBuyer({
        username: msg.username,
        email: msg.email,
        country: msg.country,
        profilePicture: msg.profilePicture,
        createdAt: msg.createdAt,
        purchasedGigs: []
      })
    // Else update purchasedGigs prop
    else await this.buyerService.updateBuyerPurchasedGigs(msg.buyerId, msg.purchasedGig, type)
  }
}
