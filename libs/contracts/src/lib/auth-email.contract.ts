import { NotificationsEmailTemplates } from '@freelance-app/helpers'

export namespace AuthEmail {
  export const exchange = 'auth-email-notification'
  export const routingKey = 'auth-email'
  export const queue = 'auth-email-queue'

  export class Request {
    receiverEmail: string
    verifyLink: string
    template: NotificationsEmailTemplates
  }
}
