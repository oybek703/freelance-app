import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { SeedGig } from '@oybek703/freelance-app-shared'
import { GigService } from '../services/gig.service'

@Injectable()
export class SeedGigsConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(SeedGigsConsumer.name)

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly gigService: GigService
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: SeedGigsConsumer.name })
    }
  }

  @RabbitRPC({
    exchange: SeedGig.exchange,
    routingKey: SeedGig.routingKey,
    queue: SeedGig.queue
  })
  private async handleGigReviewUpdate(msg: SeedGig.Request) {
    const { count, sellers } = msg
    await this.gigService.seedData(sellers, count)
  }
}
