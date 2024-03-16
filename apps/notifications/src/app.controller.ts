import { Controller, Get } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail, OrderEmail } from '@freelance-app/contracts'

@Controller()
export class AppController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Get()
  async publishMessage() {
    await this.amqpConnection.publish(AuthEmail.exchange, AuthEmail.routingKey, 'Message from auth-email')
    await this.amqpConnection.publish(OrderEmail.exchange, OrderEmail.routingKey, 'Message from order-email')
    return { success: true }
  }

  @Get('notifications-health')
  getHealth() {
    return 'Notifications service is healthy.'
  }
}
