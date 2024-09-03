export namespace GetSellers {
  export const exchange = 'gig-get-sellers'
  export const routingKey = 'get-sellers'
  export const queue = 'get-sellers-queue'

  export class Request {
    count: number
  }
}
