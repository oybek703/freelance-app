import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class Offer {
  @IsString()
  @IsOptional()
  gigTitle?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsOptional()
  deliveryInDays?: number

  @IsString()
  @IsOptional()
  oldDeliveryDate?: string

  @IsString()
  @IsOptional()
  newDeliveryDate?: string

  @IsBoolean()
  @IsOptional()
  accepted?: boolean

  @IsBoolean()
  @IsOptional()
  cancelled?: boolean
}

export class MessageDto {
  @IsString()
  @IsOptional()
  conversationId?: string

  @IsString()
  @IsOptional()
  _id?: string

  @IsString()
  @IsOptional()
  body?: string

  @IsBoolean()
  @IsOptional()
  hasConversationId?: boolean

  @IsString()
  @IsOptional()
  file?: string

  @IsString()
  @IsOptional()
  fileType?: string

  @IsString()
  @IsOptional()
  fileName?: string

  @IsString()
  @IsOptional()
  fileSize?: string

  @IsString()
  @IsOptional()
  gigId?: string

  @IsString({ message: 'Seller id is required' })
  sellerId!: string

  @IsString({ message: 'Buyer id is required' })
  buyerId!: string

  @IsString({ message: 'Sender username is required' })
  senderUsername!: string

  @IsString({ message: 'Sender picture is required' })
  senderPicture!: string

  @IsString({ message: 'Receiver username is required' })
  receiverUsername!: string

  @IsString({ message: 'Receiver picture is required' })
  receiverPicture!: string

  @IsBoolean()
  @IsOptional()
  isRead?: boolean

  @IsBoolean()
  @IsOptional()
  hasOffer?: boolean

  @ValidateNested()
  @Type(() => Offer)
  @IsOptional()
  offer?: Offer

  @IsString()
  @IsOptional()
  createdAt?: string
}
