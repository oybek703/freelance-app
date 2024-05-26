import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail, BuyerUpdate } from '@freelance-app/contracts'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BuyerUpdateProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(BuyerUpdateProducer.name)

  constructor(private readonly configService: ConfigService, private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: BuyerUpdateProducer.name })
    }
  }

  public async publishBuyerUpdate(msg: BuyerUpdate.Request) {
    await this.amqpConnection.publish(BuyerUpdate.exchange, BuyerUpdate.routingKey, msg)
    this.logger.log('Buyer details sent to buyer service.')
  }
}
