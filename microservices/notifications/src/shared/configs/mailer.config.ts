import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { NotificationsEnvVariableKeys } from '../app.constants'
import { dirname, join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

export const getMailerConfig = (configService: ConfigService): MailerOptions => {
  const smtpHost = configService.get<string>(NotificationsEnvVariableKeys.smtpHost)
  const smtpPort = configService.get<string>(NotificationsEnvVariableKeys.smtpPort)
  const smtpUserEmail = configService.get<string>(NotificationsEnvVariableKeys.smtpUserEmail)
  const smtpUserPassword = configService.get<string>(NotificationsEnvVariableKeys.smtpUserPassword)
  return {
    transport: {
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUserEmail,
        pass: smtpUserPassword
      }
    },
    template: {
      dir: join(dirname(process.argv[1]), 'assets/email-templates'),
      adapter: new EjsAdapter({ inlineCssEnabled: true })
    },
    preview: false
  }
}
