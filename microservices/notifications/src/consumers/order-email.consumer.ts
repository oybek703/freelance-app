import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { NotificationsEmailTemplates, OrderEmail } from '@oybek703/freelance-app-shared'
import { appIconUrl, NotificationsEnvVariableKeys } from '../shared/app.constants'
import { ConfigService } from '@nestjs/config'
import { dirname, join } from 'path'
import { renderFile } from 'ejs'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class OrderEmailConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(OrderEmailConsumer.name)

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: OrderEmailConsumer.name })
    }
  }

  async getTemplateData(templateFileDir: NotificationsEmailTemplates) {
    const subjectTemplateFile = join(dirname(process.argv[1]), `assets/email-templates/${templateFileDir}/subject.ejs`)
    const subject = await renderFile(subjectTemplateFile)
    return { subject, templateFile: `${templateFileDir}/html` }
  }

  @RabbitRPC({
    exchange: OrderEmail.exchange,
    routingKey: OrderEmail.routingKey,
    queue: OrderEmail.queue
  })
  public async handleOrderEmail(msg: OrderEmail.Request) {
    const clientUrl = this.configService.get<string>(NotificationsEnvVariableKeys.clientUrl)
    const { template, sender, amount, description, sellerUsername, buyerUsername, title, deliveryDays } = msg
    const { subject, templateFile } = await this.getTemplateData(template)
    // It is sent to buyerUsername, but need to check that it should be sent to receiverEmail(which not exists in request body yet)
    await this.mailerService.sendMail({
      to: buyerUsername,
      from: 'Freelance App',
      subject,
      template: templateFile,
      context: {
        appLink: clientUrl,
        appIcon: appIconUrl,
        username: sender,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        amount
      }
    })
    this.logger.log(`[${msg.template}] Email sent successfully.`)
  }
}
