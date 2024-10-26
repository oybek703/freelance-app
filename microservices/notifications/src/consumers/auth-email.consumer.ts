import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { appIconUrl, NotificationsEnvVariableKeys } from '../shared/app.constants'
import { renderFile } from 'ejs'
import { dirname, join } from 'path'
import { AuthEmail, NotificationsEmailTemplates } from '@oybek703/freelance-app-shared'

@Injectable()
export class AuthEmailConsumer implements OnApplicationShutdown {
  private readonly logger = new Logger(AuthEmailConsumer.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async onApplicationShutdown(signal?: ShutdownSignal) {
    if (signal === ShutdownSignal.SIGINT) {
      await this.amqpConnection.close()
      this.logger.log('info', 'Amqp connection closed.', { consumer: AuthEmailConsumer.name })
    }
  }

  async getTemplateData(templateFileDir: NotificationsEmailTemplates) {
    const subjectTemplateFile = join(dirname(process.argv[1]), `assets/email-templates/${templateFileDir}/subject.ejs`)
    const subject = await renderFile(subjectTemplateFile)
    return { subject, templateFile: `${templateFileDir}/html` }
  }

  @RabbitRPC({
    exchange: AuthEmail.exchange,
    routingKey: AuthEmail.routingKey,
    queue: AuthEmail.queue
  })
  public async handleAuthEmail(msg: AuthEmail.Request) {
    const clientUrl = this.configService.get<string>(NotificationsEnvVariableKeys.clientUrl)
    const { receiverEmail, template, verifyLink, username, resetLink } = msg
    const { subject, templateFile } = await this.getTemplateData(template)
    await this.mailerService.sendMail({
      to: receiverEmail,
      from: 'Freelance App',
      subject,
      template: templateFile,
      context: {
        appLink: clientUrl,
        appIcon: appIconUrl,
        verifyLink,
        username,
        resetLink
      }
    })
    this.logger.log(`[${msg.template}] Email sent successfully.`)
  }
}
