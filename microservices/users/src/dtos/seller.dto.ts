import { ICertificate, IEducation, IExperience, ILanguage, IRatingCategory } from '../schemas/seller.schema'
import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Optional } from '@nestjs/common'

class Language implements ILanguage {
  @IsString()
  language: string

  @IsString()
  level: string
}

class RatingCategory implements IRatingCategory {
  @IsNumber()
  count: number

  @IsNumber()
  value: number
}

class Certificate implements ICertificate {
  @IsString()
  from: string

  @IsString()
  name: string

  @IsString()
  year: string
}

class Experience implements IExperience {
  @IsString()
  company: string

  @IsBoolean()
  currentlyWorkingHere: boolean

  @IsString()
  description: string

  @IsString()
  endDate: string

  @IsString()
  startDate: string

  @IsString()
  title: string
}

class Education implements IEducation {
  @IsString()
  country: string

  @IsString()
  major: string

  @IsString()
  title: string

  @IsString()
  university: string

  @IsString()
  year: string
}

export class SellerDto {
  @IsString()
  fullName: string

  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  profilePicture: string

  @IsString()
  description: string

  @IsString()
  profilePublicId: string

  @IsString()
  oneliner: string

  @IsString()
  country: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Language)
  languages: ILanguage[]

  @IsArray({ each: true })
  skills: string[]

  @Optional()
  @IsNumber()
  ratingsCount?: number

  @Optional()
  @IsNumber()
  ratingSum?: number

  @Optional()
  @ValidateNested({ each: true })
  @Type(() => RatingCategory)
  ratingCategories?: {
    five: IRatingCategory
    four: IRatingCategory
    three: IRatingCategory
    two: IRatingCategory
    one: IRatingCategory
  }

  @IsNumber()
  responseTime: number

  @Optional()
  @IsDate()
  recentDelivery?: Date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Experience)
  experience: IExperience[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Education)
  education: IEducation[]

  @IsArray({ each: true })
  socialLinks: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Certificate)
  certificates: ICertificate[]

  @Optional()
  @IsNumber()
  ongoingJobs?: number

  @Optional()
  @IsNumber()
  completedJobs?: number

  @Optional()
  @IsNumber()
  cancelledJobs?: number

  @Optional()
  @IsNumber()
  totalEarnings?: number

  @Optional()
  @IsNumber()
  totalGigs?: number
}
