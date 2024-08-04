export namespace BuyerUpdate {
  export const exchange = 'buyer--update-notification'
  export const routingKey = 'buyer-update'
  export const queue = 'buyer-update-queue'

  export class Request {
    username: string
    email: string
    profilePicture: string
    country: string
    createdAt: string
    type: BuyerUpdatesTypes
  }

  export enum BuyerUpdatesTypes {
    auth = 'auth'
  }
}
