import { Injectable, Logger } from '@nestjs/common'
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail } from '@freelance-app/contracts'

@Injectable()
export class AuthEmailConsumer {
  constructor(private readonly logger: Logger) {}

  @RabbitRPC({
    exchange: AuthEmail.exchange,
    routingKey: AuthEmail.routingKey,
    queue: AuthEmail.queue
  })
  public async handleAuthEmail(msg: unknown) {
    this.logger.log(msg)
  }
}
