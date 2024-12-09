import { NotificationsEmailTemplates } from '../helpers/global.constants'

export namespace OrderEmail {
  export const exchange = 'order-email-notification'
  export const routingKey = 'order-email'
  export const queue = 'order-email-queue'

  export class Request {
    sender: string
    amount: number
    buyerUsername: string
    sellerUsername: string
    title?: string
    description?: string
    deliveryDays: string
    template: NotificationsEmailTemplates
  }
}
