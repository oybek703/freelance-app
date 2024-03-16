import { Injectable, Logger } from '@nestjs/common'
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { AuthEmail } from '@freelance-app/contracts'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { appIconUrl, EnvVariableKeys } from '../app.constants'
import { renderFile } from 'ejs'
import { join } from 'path'
import { NotificationsEmailTemplates } from '@freelance-app/helpers'

@Injectable()
export class AuthEmailConsumer {
  constructor(
    private readonly logger: Logger,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async getTemplateData(templateFileDir: NotificationsEmailTemplates) {
    const subjectTemplateFile = join(__dirname, `assets/email-templates/${templateFileDir}/subject.ejs`)
    const subject = await renderFile(subjectTemplateFile)
    return { subject, templateFile: `${templateFileDir}/html` }
  }

  @RabbitRPC({
    exchange: AuthEmail.exchange,
    routingKey: AuthEmail.routingKey,
    queue: AuthEmail.queue
  })
  public async handleAuthEmail(msg: AuthEmail.Request) {
    const clientUrl = this.configService.get<string>(EnvVariableKeys.clientUrl)
    const { receiverEmail, template, verifyLink } = msg
    const { subject, templateFile } = await this.getTemplateData(template)
    await this.mailerService.sendMail({
      to: receiverEmail,
      from: 'Freelance App',
      subject,
      template: templateFile,
      context: {
        appLink: clientUrl,
        appIcon: appIconUrl,
        verifyLink
      }
    })
    this.logger.log('Email send successfully!')
  }
}
