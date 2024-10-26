import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { SellerUpdate } from '@oybek703/freelance-app-shared'

@Injectable()
export class SellerUpdateProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(SellerUpdateProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: SellerUpdateProducer.name })
    }
  }

  public async publishSellerGigUpdate(msg: SellerUpdate.Request) {
    await this.amqpConnection.publish(SellerUpdate.exchange, SellerUpdate.routingKey, msg)
    this.logger.log(`Update seller gig info sent to users service.`)
  }
}
