export interface ISellerGig {
  sellerId: string
  username: string
  profilePicture: string
  email: string
  title: string
  description: string
  categories: string
  subCategories: string[]
  tags: string[]
  active: boolean
  expectedDelivery: string
  basicTitle: string
  basicDescription: string
  ratingsCount: number
  ratingSum: number
  price: number
  sortId: number
  ratingCategories: RatingCategories
  coverImage: string
  createdAt: string
  id: string
}

export interface RatingCategories {
  five: RatingCategory
  four: RatingCategory
  three: RatingCategory
  two: RatingCategory
  one: RatingCategory
}

export interface RatingCategory {
  value: number
  count: number
}
