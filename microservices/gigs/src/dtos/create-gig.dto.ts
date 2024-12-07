import { ISellerGig, RatingCategories } from '@oybek703/freelance-app-shared'
import { Optional } from '@nestjs/common'
import { IsArray, IsString } from 'class-validator'

export class CreateGigDto implements ISellerGig {
  @IsString()
  sellerId: string

  @IsString()
  username: string

  @IsString()
  profilePicture: string

  @IsString()
  email: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  categories: string

  @IsArray({ each: true })
  @IsString()
  subCategories: string[]

  @IsArray({ each: true })
  @Optional()
  @IsString()
  tags: string[]

  @Optional()
  active: boolean

  @Optional()
  expectedDelivery: string

  @IsString()
  basicTitle: string

  @IsString()
  basicDescription: string

  @Optional()
  ratingsCount: number

  @Optional()
  ratingSum: number

  @Optional()
  price: number

  @Optional()
  sortId: number

  @Optional()
  ratingCategories: RatingCategories

  @IsString()
  coverImage: string

  @Optional()
  createdAt: string

  @Optional()
  id: string
}
