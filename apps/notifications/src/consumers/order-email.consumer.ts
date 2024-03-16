import { Injectable, Logger } from '@nestjs/common'
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { OrderEmail } from '@freelance-app/contracts'

@Injectable()
export class OrderEmailConsumer {
  constructor(private readonly logger: Logger) {}

  @RabbitRPC({
    exchange: OrderEmail.exchange,
    routingKey: OrderEmail.routingKey,
    queue: OrderEmail.queue
  })
  public async handleOrderEmail(msg: unknown) {
    this.logger.log(msg)
  }
}
