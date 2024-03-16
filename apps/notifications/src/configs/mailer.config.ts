import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from '../app.constants'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

export const getMailerConfig = (configService: ConfigService): MailerOptions => {
  const smtpHost = configService.get<string>(EnvVariableKeys.smtpHost)
  const smtpPort = configService.get<string>(EnvVariableKeys.smtpPort)
  const smtpUserEmail = configService.get<string>(EnvVariableKeys.smtpUserEmail)
  const smtpUserPassword = configService.get<string>(EnvVariableKeys.smtpUserPassword)
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
      dir: join(__dirname, 'assets/email-templates'),
      adapter: new EjsAdapter({ inlineCssEnabled: true })
    },
    preview: false
  }
}
