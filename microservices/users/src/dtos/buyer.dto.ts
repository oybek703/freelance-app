import { IsArray, IsBoolean, IsDate, IsEmail, IsString } from 'class-validator'

export class BuyerDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  profilePicture: string

  @IsString()
  country: string

  @IsBoolean()
  isSeller: boolean

  @IsArray()
  purchasedGigs: string[]

  @IsDate()
  createdAt: Date
}
