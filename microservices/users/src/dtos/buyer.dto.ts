import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator'

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
  isSeller?: boolean

  @IsArray()
  purchasedGigs: string[]

  @IsString()
  createdAt: string
}
