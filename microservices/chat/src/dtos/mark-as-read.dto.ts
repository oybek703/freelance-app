import { IsString } from 'class-validator'

export class MarkAsReadDto {
  @IsString()
  messageId: string
}
