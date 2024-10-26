import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { UpdateGig } from '@oybek703/freelance-app-shared'
import { GigService } from '../services/gig.service'

@Injectable()
export class GigUpdateConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(GigUpdateConsumer.name)

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly gigService: GigService
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: GigUpdateConsumer.name })
    }
  }

  @RabbitRPC({
    exchange: UpdateGig.exchange,
    routingKey: UpdateGig.routingKey,
    queue: UpdateGig.queue
  })
  private async handleGigReviewUpdate(msg: UpdateGig.Request) {
    await this.gigService.updateGigReview(msg.gigId, msg)
  }
}
