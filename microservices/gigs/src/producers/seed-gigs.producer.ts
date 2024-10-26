import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { GetSellers } from '@oybek703/freelance-app-shared'

@Injectable()
export class SeedGigsProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(SeedGigsProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: SeedGigsProducer.name })
    }
  }

  public async publishGetSellers(msg: GetSellers.Request) {
    await this.amqpConnection.publish(GetSellers.exchange, GetSellers.routingKey, msg)
    this.logger.log(`Gig seed message sent to users service.`)
  }
}
