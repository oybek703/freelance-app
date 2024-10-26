import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { OrderEmail } from '@oybek703/freelance-app-shared'

@Injectable()
export class OrderEmailConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(OrderEmailConsumer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: OrderEmailConsumer.name })
    }
  }

  @RabbitRPC({
    exchange: OrderEmail.exchange,
    routingKey: OrderEmail.routingKey,
    queue: OrderEmail.queue
  })
  public async handleOrderEmail(msg: unknown) {
    this.logger.log(msg)
  }
}
