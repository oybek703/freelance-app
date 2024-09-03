export namespace UpdateGig {
  export const exchange = 'update-gig-review'
  export const routingKey = 'update-gig'
  export const queue = 'update-gig-queue'

  export class Request {
    gigId: string
    reviewerId: string
    sellerId?: string
    review?: string
    rating: number
    orderId?: string
    createdAt?: string
  }
}
