export namespace BuyerReview {
  export const exchange = 'buyer-gig-review'
  export const queue = 'buyer-gig-queue'

  export class Request {
    type: BuyerReviewUpdatesTypes
    rating: string
    sellerId: string
    gigId: string
  }

  export enum BuyerReviewUpdatesTypes {
    buyerReview = 'buyer-review'
  }
}
