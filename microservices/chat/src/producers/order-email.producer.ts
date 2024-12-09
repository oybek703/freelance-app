import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { OrderEmail } from '@oybek703/freelance-app-shared'

@Injectable()
export class OrderEmailProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(OrderEmailProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: OrderEmailProducer.name })
    }
  }

  public async publishOrderEmail(msg: OrderEmail.Request) {
    await this.amqpConnection.publish(OrderEmail.exchange, OrderEmail.routingKey, msg)
    this.logger.log(`[${msg.template}] Email sent successfully.`)
  }
}
