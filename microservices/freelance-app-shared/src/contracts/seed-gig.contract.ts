export namespace SeedGig {
  export const exchange = 'seed-gig-sellers'
  export const routingKey = 'seed-gig'
  export const queue = 'seed-gig-queue'

  export class Request {
    sellers: unknown[]
    count: number
  }
}
