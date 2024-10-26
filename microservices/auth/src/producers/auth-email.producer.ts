import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail } from '@oybek703/freelance-app-shared'

@Injectable()
export class AuthEmailProducer implements OnApplicationShutdown {
  private readonly logger = new Logger(AuthEmailProducer.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { producer: AuthEmailProducer.name })
    }
  }

  public async publishAuthEmail(msg: AuthEmail.Request) {
    await this.amqpConnection.publish(AuthEmail.exchange, AuthEmail.routingKey, msg)
    this.logger.log(`[${msg.template}] Email sent successfully.`)
  }
}
