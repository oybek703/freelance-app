export namespace SellerUpdate {
  export const exchange = 'seller-update-order'
  export const routingKey = 'seller-update'
  export const queue = 'seller-update-queue'

  export class Request {
    type: SellerUpdatesTypes
    sellerId?: string
    ongoingJobs?: number
    completedJobs?: number
    totalEarnings?: number
    recentDelivery?: Date
    gigSellerId?: string
    count?: number
  }

  export enum SellerUpdatesTypes {
    createOrder = 'create-order',
    approveOrder = 'approve-order',
    updateGigCount = 'update-gig-count',
    cancelOrder = 'cancel-order'
  }
}
