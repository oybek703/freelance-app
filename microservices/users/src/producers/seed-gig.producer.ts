import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { SeedGig } from '@oybek703/freelance-app-shared'

@Injectable()
export class SeedGigProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(SeedGigProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: SeedGigProducer.name })
    }
  }

  public async publishSeedGigSellers(msg: SeedGig.Request) {
    await this.amqpConnection.publish(SeedGig.exchange, SeedGig.routingKey, msg)
    this.logger.log(`Seed gig sellers sent to gig service.`)
  }
}
