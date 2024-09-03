import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { BuyerReview, SellerUpdate } from '@oybek703/freelance-app-shared'
import { SellerService } from '../services/seller.service'
import { UpdateGigProducer } from '../producers/update-gig.producer'

@Injectable()
export class SellerUpdateConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(SellerUpdateConsumer.name)

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly sellerService: SellerService,
    private readonly updateGigProducer: UpdateGigProducer
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: SellerUpdateConsumer.name })
    }
  }

  @RabbitRPC({
    exchange: SellerUpdate.exchange,
    routingKey: SellerUpdate.routingKey,
    queue: SellerUpdate.queue
  })
  private async handleSellerUpdate(msg: SellerUpdate.Request) {
    const { type, sellerId, gigSellerId, ongoingJobs, completedJobs, recentDelivery, totalEarnings, count } = msg
    switch (type) {
      case SellerUpdate.SellerUpdatesTypes.createOrder:
        await this.sellerService.updateOngoingJobs(sellerId, ongoingJobs)
        break

      case SellerUpdate.SellerUpdatesTypes.approveOrder:
        await this.sellerService.updateCompletedJobs({
          ongoingJobs,
          completedJobs,
          recentDelivery,
          totalEarnings,
          sellerId
        })
        break

      case SellerUpdate.SellerUpdatesTypes.updateGigCount:
        await this.sellerService.updateTotalGigsCount(gigSellerId, count)
        break

      case SellerUpdate.SellerUpdatesTypes.cancelOrder:
        await this.sellerService.updateCancelledJobs(sellerId)
        break
    }
  }

  @RabbitRPC({
    exchange: BuyerReview.exchange,
    routingKey: '',
    queue: BuyerReview.queue
  })
  private async handleBuyerReview(msg: BuyerReview.Request) {
    const { type, sellerId, rating, gigId } = msg
    if (type === BuyerReview.BuyerReviewUpdatesTypes.buyerReview) {
      await this.sellerService.updateSellerReview({ sellerId, rating })
      await this.updateGigProducer.publishUpdateGigReview({ gigId, reviewerId: sellerId, rating: +rating })
    }
  }
}
