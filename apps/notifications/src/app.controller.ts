import { Controller, Get } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail, OrderEmail } from '@freelance-app/contracts'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from './app.constants'
import { NotificationsEmailTemplates } from '@freelance-app/helpers'

@Controller()
export class AppController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly configService: ConfigService) {}

  // TODO This is test route for RabbitMQ, remove it later
  @Get()
  async publishMessage() {
    const clientUrl = this.configService.get<string>(EnvVariableKeys.clientUrl)
    const smtpUserEmail = this.configService.get<string>(EnvVariableKeys.smtpUserEmail)
    const authEmailBody: AuthEmail.Request = {
      receiverEmail: smtpUserEmail,
      template: NotificationsEmailTemplates.verifyEmail,
      verifyLink: `${clientUrl}/confirm-email?token=OINIBBVUVURCYTEDTXER%$XE#$JNI`
    }
    await this.amqpConnection.publish<AuthEmail.Request>(AuthEmail.exchange, AuthEmail.routingKey, authEmailBody)
    // await this.amqpConnection.publish(OrderEmail.exchange, OrderEmail.routingKey, 'Message from order-email')
    return { success: true }
  }

  @Get('notifications-health')
  getHealth() {
    return 'Notifications service is healthy.'
  }
}
