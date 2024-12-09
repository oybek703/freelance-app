import { IsString } from 'class-validator'

export class UpdateOffer {
  @IsString()
  messageId: string

  @IsString()
  type: string
}
