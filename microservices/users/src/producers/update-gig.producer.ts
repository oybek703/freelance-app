import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { UpdateGig } from '@oybek703/freelance-app-shared'

@Injectable()
export class UpdateGigProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(UpdateGigProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: UpdateGigProducer.name })
    }
  }

  public async publishUpdateGigReview(msg: UpdateGig.Request) {
    await this.amqpConnection.publish(UpdateGig.exchange, UpdateGig.routingKey, msg)
    this.logger.log(`Update gig sent to gig service.`)
  }
}
