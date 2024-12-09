import { IsString } from 'class-validator'

export class MarkAsReadMultipleDto {
  @IsString()
  messageId: string

  @IsString()
  sender: string

  @IsString()
  receiver: string
}
